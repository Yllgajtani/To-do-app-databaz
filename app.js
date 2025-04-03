document.addEventListener("DOMContentLoaded", () => {
    const todosContainer = document.getElementById("todos");
    const addTodoButton = document.getElementById("addTodo");
    const nameInput = document.getElementById("name");
    const kategoriaInput = document.getElementById("kategoria");
    const proritetiInput = document.getElementById("proriteti");
    const kohaInput = document.getElementById("koha");

    // Fetch all todos and display them
    function fetchTodos() {
        fetch("http://localhost:3000/todos")
            .then(response => response.json())
            .then(todos => {
                todosContainer.innerHTML = "";
                todos.forEach(todo => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <span>${todo.Name} - ${todo.kategoria} - ${todo.Proriteti} - ${todo.koha}</span>
                        <button class="delete" data-id="${todo._id}">Delete</button>
                    `;
                    todosContainer.appendChild(li);
                });

                // Add delete event listener
                const deleteButtons = document.querySelectorAll(".delete");
                deleteButtons.forEach(button => {
                    button.addEventListener("click", (e) => {
                        const todoId = e.target.getAttribute("data-id");
                        deleteTodo(todoId);
                    });
                });
            })
            .catch(err => console.error("Error fetching todos:", err));
    }

    // Add a new todo
    addTodoButton.addEventListener("click", () => {
        const newTodo = {
            Name: nameInput.value,
            kategoria: kategoriaInput.value,
            Proriteti: proritetiInput.value,
            koha: kohaInput.value
        };

        fetch("http://localhost:3000/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTodo)
        })
            .then(response => response.json())
            .then(() => {
                nameInput.value = "";
                kategoriaInput.value = "";
                proritetiInput.value = "";
                kohaInput.value = "";
                fetchTodos();  // Refresh the todo list
            })
            .catch(err => console.error("Error adding todo:", err));
    });

    // Delete a todo
    function deleteTodo(id) {
        fetch(`http://localhost:3000/todos/${id}`, {
            method: "DELETE"
        })
            .then(response => response.json())
            .then(() => {
                fetchTodos();  // Refresh the todo list after deletion
            })
            .catch(err => console.error("Error deleting todo:", err));
    }

    // Initial fetch of todos
    fetchTodos();
});