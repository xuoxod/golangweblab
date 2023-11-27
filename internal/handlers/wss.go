package handlers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var wsChan = make(chan WsPayload)

var clients = make(map[WebSocketConnection]map[string]string)

var upgradeConnection = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type WebSocketConnection struct {
	*websocket.Conn
}

type WsJsonResponse struct {
	Action      string              `json:"action"`
	Message     string              `json:"message"`
	MessageType string              `json:"message_type"`
	From        string              `json:"from"`
	To          string              `json:"to"`
	Level       string              `json:"level"`
	Title       string              `json:"title"`
	Fname       string              `json:"fname"`
	Lname       string              `json:"lname"`
	Email       string              `json:"email"`
	Visible     string              `json:"visible"`
	Users       map[string][]string `json:"users"`
	Exit        string              `json:"exit"`
}

type WsPayload struct {
	Action  string              `json:"action"`
	Message string              `json:"message"`
	Fname   string              `json:"fname"`
	Lname   string              `json:"lname"`
	Email   string              `json:"email"`
	Visible string              `json:"visible"`
	Conn    WebSocketConnection `json:"-"`
	Exit    string              `json:"exit"`
}

func WsEndpoint(w http.ResponseWriter, r *http.Request) {
	ws, err := upgradeConnection.Upgrade(w, r, nil)

	if err != nil {
		log.Println("Error upgrading the connection")
	}

	log.Println("Client connected to endpoint")

	var response WsJsonResponse

	response.Message = `<em><small>Connected to Server</small></em>`

	conn := WebSocketConnection{Conn: ws}
	strMap := make(map[string]string)
	strMap["ip"] = fmt.Sprintf("%v", conn.RemoteAddr())
	strMap["visible"] = fmt.Sprintf("%t", false)
	strMap["fname"] = ""
	strMap["lname"] = ""
	strMap["email"] = ""
	clients[conn] = strMap

	err = ws.WriteJSON(response)

	if err != nil {
		log.Println("Error writing to the client")
	}

	go ListenForWs(&conn)
}

func ListenForWs(conn *WebSocketConnection) {
	defer func() {
		if r := recover(); r != nil {
			// log.Println("Error", fmt.Sprintf("%v", r))
			// log.Println("Client connection error")
			handleUserExit(*conn)
		}
	}()

	var payload WsPayload

	for {
		err := conn.ReadJSON(&payload)

		if err != nil {
			// do nothing
		} else {
			payload.Conn = *conn
			wsChan <- payload
		}
	}
}

func ListenToWsChannel() {
	for {
		e := <-wsChan

		switch e.Action {
		case "initconnect":
			fname := e.Fname
			lname := e.Lname
			email := e.Email
			v := e.Visible
			var visible bool

			if v == "true" {
				visible = true
			} else {
				visible = false
			}
			client := clients[e.Conn]
			client["fname"] = fname
			client["lname"] = lname
			client["email"] = email
			client["visible"] = fmt.Sprintf("%t", visible)
			broadcastOnlineUsers()
		case "exit":
			handleUserExit(e.Conn)

		case "broadcast":
			fmt.Println("Broadcast")
			// broadcastToAll(response)
		}

		// response.Action = "Got here"
		// response.Message = fmt.Sprintf("Some message and action was %s ", e.Action)
		// broadcastToAll(response)
	}
}

func handleUserExit(conn WebSocketConnection) {
	fmt.Println("User exited")
	delete(clients, conn)
	broadcastOnlineUsers()
}

func broadcastOnlineUsers() {
	if len(clients) > 0 {
		var response WsJsonResponse
		onlineClients := make(map[string][]string)

		for client := range clients {
			dict := clients[client]

			onlineClients[dict["ip"]] = []string{dict["fname"], dict["lname"], dict["email"], dict["visible"]}
		}

		response.Users = onlineClients
		response.Action = "userlist"
		broadcastToAll(response)
	}
}

func broadcastToAll(response WsJsonResponse) {
	for client := range clients {
		err := client.WriteJSON(response)

		if err != nil {
			log.Println("Web socket error")

			_ = client.Close()

			delete(clients, client)
		}
	}
}

func checkUsernameExists(conn WebSocketConnection, username string, id string) {
	var response WsJsonResponse

	for client := range clients {
		dict := clients[client]

		if dict["id"] != id {
			if username == dict["username"] {
				response.Action = "badusername"
				response.Title = "Username Error"
				response.Level = "error"
				response.Message = fmt.Sprintf("Username %s is already taken", username)
				sendToClient(conn, response)
				return
			}
		}
	}

	dict := clients[conn]
	dict["username"] = username
	dict["online"] = fmt.Sprintf("%t", true)

	response.Action = "goodusername"
	response.Message = username
	sendToClient(conn, response)
}

func sendToClient(conn WebSocketConnection, response WsJsonResponse) {
	err := conn.WriteJSON(response)

	if err != nil {
		log.Println("Error send response to client:\t", err.Error())

		_ = conn.Close()

		delete(clients, conn)
	}
}
