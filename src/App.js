import React, { Component } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import axios from "axios";
import io from "socket.io-client";
const socket = io.connect("http://localhost:5000");

export default class App extends Component {
  state = {
    todoList: [],
    activeItem: {
      title: ""
    },
    editItem: false,
    notificationCount: 0,
    baseURL: "http://localhost:5000"
  };

  componentDidMount() {
    this.refreshList();
    socket.on("notification", (tasksCount) => {
      console.log("notificationCount",  tasksCount)
      this.setState({
          notificationCount: tasksCount
      })
    });
  }

  refreshList = () => {
    axios
      .get(`${this.state.baseURL}/api/v1/todo`)
      .then((res) => this.setState({ todoList: res.data.todos, totalCount:  res.data.total_record}))
      .catch((err) => console.log(err));
  };

  handleChange = (e) => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    const activeItem = { ...this.state.activeItem, [name]: value };
    this.setState({ activeItem });
  };

  handleSubmit = (item) => {
    this.setState({
      editItem: false,
    });
    if (item._id) {
      axios
        .put(`${this.state.baseURL}/api/v1/todo/${item._id}/`, {title: item.title, completed: item.completed})
        .then((res) => this.refreshList());
      return;
    }
    axios.post(`${this.state.baseURL}/api/v1/todo/`, item).then((res) => this.refreshList());
  };

  handleEdit = (item) => {
    this.setState({ activeItem: item, editItem: true });
  };

  handleDelete = (item) => {
    axios
      .delete(`${this.state.baseURL}/api/v1/todo/${item._id}/`)
      .then((res) => this.refreshList());
  };

  render() {
    const divStyle = {
      color: 'white',
      backgroundColor: 'gray',
    
    };
    return (
      <div className="container">
        <div className="row pt-4 pb-4" style={divStyle}> 
          <span className="col-8">admin</span>
          <span className="col-2"><span style={{ position: 'relative' }}>
          {/* Notification badge */}
          <button type="button" class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"></path> 
            </svg>
          </button>
          {/* Notification badge */}
          {this.state.notificationCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '3px',
                fontSize: '12px',
              }}
            >
              {this.state.notificationCount}
            </span>
          )}
        </span></span>
          <span className="col-2"> <button className="btn btn-secondary"> Logout </button></span>
        </div>
        <h1 className="text-center my-2">Todos ({this.state.totalCount}) </h1>
        <div className="row">
          <div className="col-8 col-md-6 mx-auto">
            <TodoInput
              activeItem={this.state.activeItem}
              editItem={this.state.editItem}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
            />
            <TodoList
              items={this.state.todoList}
              handleEdit={this.handleEdit}
              handleDelete={this.handleDelete}
            />
          </div>
        </div>
      </div>
    );
  }
}
