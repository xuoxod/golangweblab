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
	Action           string              `json:"action"`
	Message          string              `json:"message"`
	MessageType      string              `json:"message_type"`
	From             string              `json:"from"`
	To               string              `json:"to"`
	Level            string              `json:"level"`
	Title            string              `json:"title"`
	Fname            string              `json:"fname"`
	Lname            string              `json:"lname"`
	Email            string              `json:"email"`
	Visible          string              `json:"visible"`
	PermanentVisible string              `json:"permvisible"`
	Users            map[string][]string `json:"users"`
	Exit             string              `json:"exit"`
}

type WsPayload struct {
	Action           string              `json:"action"`
	Message          string              `json:"message"`
	MessageType      string              `json:"message_type"`
	From             string              `json:"from"`
	To               string              `json:"to"`
	Level            string              `json:"level"`
	Title            string              `json:"title"`
	Fname            string              `json:"fname"`
	Lname            string              `json:"lname"`
	Email            string              `json:"email"`
	Visible          string              `json:"visible"`
	PermanentVisible string              `json:"permvisible"`
	Conn             WebSocketConnection `json:"-"`
	Exit             string              `json:"exit"`
}

func WsEndpoint(w http.ResponseWriter, r *http.Request) {
	ws, err := upgradeConnection.Upgrade(w, r, nil)

	if err != nil {
		log.Println("Error upgrading the connection")
	}

	log.Println("Client connected to endpoint")

	var response WsJsonResponse

	response.Message = `Client Connected to the Server`

	conn := WebSocketConnection{Conn: ws}
	strMap := make(map[string]string)
	strMap["ip"] = fmt.Sprintf("%v", conn.RemoteAddr())
	strMap["visible"] = fmt.Sprintf("%t", false)
	strMap["permvisible"] = fmt.Sprintf("%t", true)
	strMap["busy"] = fmt.Sprintf("%t", false)
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
			handleInitConnect(e)
		case "exit":
			handleUserExit(e.Conn)

		case "hide":
			handleHide(e.Conn)

		case "unhide":
			handleUnhide(e.Conn)

		case "broadcast":
			handleBroadcastMessage(e)

		case "onetoone":
			handleOneToOneMessage(e)
		}

	}
}

func handleOneToOneMessage(payload WsPayload) {
	for c := range clients {
		if clients[c]["email"] == payload.To {
			var response WsJsonResponse
			from := payload.From
			message := payload.Message
			response.From = from
			response.Email = payload.Email
			response.Message = message
			response.Action = "onetoone"
			err := c.WriteJSON(response)
			if err != nil {
				log.Println(err.Error())
				fmt.Println("Error sending one to one message")
			}
			return
		}
	}
}

func handleBroadcastMessage(payload WsPayload) {

}

func handleInitConnect(e WsPayload) {
	fname := e.Fname
	lname := e.Lname
	email := e.Email
	v := e.Visible
	var visible bool
	pv := e.PermanentVisible
	var permvisible bool

	if v == "true" {
		visible = true
	} else {
		visible = false
	}

	if pv == "true" {
		permvisible = true
	} else {
		permvisible = false
	}

	client := clients[e.Conn]
	client["fname"] = fname
	client["lname"] = lname
	client["email"] = email
	client["visible"] = fmt.Sprintf("%t", visible)
	client["permvisible"] = fmt.Sprintf("%t", permvisible)
	broadcastOnlineUsers()
}

func handleHide(conn WebSocketConnection) {
	client := clients[conn]
	client["visible"] = fmt.Sprintf("%t", false)
	broadcastOnlineUsers()
}

func handleUnhide(conn WebSocketConnection) {
	client := clients[conn]
	client["visible"] = fmt.Sprintf("%t", true)
	broadcastOnlineUsers()
}

func handleUserExit(conn WebSocketConnection) {
	fmt.Println("User exited")
	delete(clients, conn)
	broadcastOnlineUsers()
}

func broadcastOnlineUsers() {
	var response WsJsonResponse
	onlineClients := make(map[string][]string)

	for client := range clients {
		dict := clients[client]
		onlineClients[dict["ip"]] = []string{dict["fname"], dict["lname"], dict["email"], dict["visible"], dict["permvisible"], dict["busy"]}
	}

	response.Users = onlineClients
	response.Action = "userlist"
	broadcastToAll(response)
}

func broadcastToAll(response WsJsonResponse) {
	for client := range clients {
		err := client.WriteJSON(response)

		if err != nil {
			log.Println("Client socket write error")

			_ = client.Close()

			delete(clients, client)
		}
	}
}
