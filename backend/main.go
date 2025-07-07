package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)


var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool{
		return true
	},
}

type Client struct {
	conn *websocket.Conn
	send chan []byte
}

var clients = make(map[*Client]bool)
var broadcast = make(chan []byte)

func main() {
	http.HandleFunc("/ws", handleConnections)

	go handleMessages()

	fmt.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe("10.14.159.4:8080", nil))
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("[ERROR]: establishing a ws connection : ", err)
		return
	}
	defer ws.Close()

	client := &Client{
		conn: ws,
		send: make(chan []byte),
	}

	clients[client] = true

	go readMessages(client)
	
	for msg := range client.send {
		err := ws.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			log.Println("[ERROR]: write error :", err)
			break
		}
	}
}

func readMessages(client *Client){
	defer func(){
		delete(clients, client)
		client.conn.Close()
	}()
	

	for{
		_, msg, err := client.conn.ReadMessage()
		if err != nil {
			log.Println("[ERROR]: read error : ", err)
			break
		}
		broadcast <- msg
	}
}

func handleMessages() {
	for {
		msg := <-broadcast
		for client := range clients {
			go func(c *Client){
				c.send <- msg
			}(client)
		}
	}
}

