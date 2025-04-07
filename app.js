document.addEventListener('DOMContentLoaded', function () {
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const addBtn = document.getElementById('add-btn');
    const clearCompletedBtn = document.createElement('button');
    clearCompletedBtn.id = "clear-completed";
    clearCompletedBtn.textContent = "Clear Completed";
    todoList.parentElement.appendChild(clearCompletedBtn);

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let touchStartY = 0;
    let touchEndY = 0;

    // debounce function to prevent multiple rapid calls

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        }
    }


    // function to load existing todos with animation

    function loadTodos() {
        todoList.innerHTML = '';
        todos.forEach(function (todo, index) {
            const todoElement = createTodoElement(todo);
            todoElement.style.animation = `fadeIn 0.3s ease-in-out ${index * 0.1}s`;
            todoList.appendChild(todoElement);
        });

        updateClearCompletedButton();
    };

    // function to create todo element with improved touch handling

    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? "completed" : ""}`;

        li.innerHTML = `
        <div class="todo-content">
            <input type="checkbox" class="checkbox" ${todo.completed ? "checked" : ""}>
            <span class="todo-text" contenteditable="true">${todo.text}</span>
            <button class="delete-btn" aria-label="Delete todo">
            <img src="bin.png" alt="Delete icon" width="24" height="24">
            </button>

        </div>

             `;

        const deleteBtn = li.querySelector('.delete-btn');
        const checkbox = li.querySelector('.checkbox');
        const todoText = li.querySelector('.todo-text');

        //    handle contenteditable todo text

        todoText.addEventListener("blur", () => {
            const newText = todoText.textContent.trim();
            if (newText && newText !== todo.text) {
                updateTodoText(todo.id, newText);
            } else {
                todoText.textContent = todo.text;
            }
        });

        //    Touch handling for swipe to delete

        li.addEventListener('touchstart', (event) => {
            touchStartY = event.touches[0].clientY;
            li.style.transition = 'none';
        });

        li.addEventListener('touchmove', (event) => {
            touchEndY = event.touches[0].clientY;
            const diffy = touchEndY - touchStartY;
            if (Math.abs(diffy) > 10) {
                li.style.transform = `translateX(${-Math.min(Math.abs(diffy), 100)}px)`;

            }
        });

        li.addEventListener('touchend', () => {
            li.style.transition = 'transform 0.3s ease-in-out';
            if (Math.abs(touchEndY - touchStartY) > 100) {
                deleteTodo(todo.id);
            } else {
                li.style.transform = "";
            }

        });


        //  addEventListener

        checkbox.addEventListener("change", () => toggleComplete(todo.id));
        li.classList.toggle("completed", checkbox.checked);
        deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

        return li;
    }

    // add new todo with validation and animation

    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            const newTodo = {
                id: Date.now(),
                text: text,
                completed: false
            };
            todos.push(newTodo);
            saveTodos();

            const todoElement = createTodoElement(newTodo);
            todoElement.style.animation = 'fadeIn 0.3s ease-in-out';
            todoList.appendChild(todoElement);
            todoInput.value = '';

            // update on mobile devices for notification

            if (navigator.vibrate) {
                navigator.vibrate(50);
            }

        }
    }

    // toggle complete staus
    function toggleComplete(id) {
        todos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        updateClearCompletedButton();
        loadTodos();
    }

    // updata todo text
    function updateTodoText(id, newText) {
        todos = todos.map(todo =>
            todo.id === id ? { ...todo, text: newText } : todo
        );
        saveTodos();
    }

    // delete todo with animation
    function deleteTodo(id) {
        const todoElement = document.querySelector(`[data-id="${id}"]`);
        if (todoElement) {
            todoElement.style.animation = 'fadeOut 0.3s ease-in-out';
            todoElement.addEventListener('animationend', () => {
                todos = todos.filter(todo => todo.id !== id);
                saveTodos();
                loadTodos();
            });
        }

    }

    // Update clear completed button visibility
    function updateClearCompletedButton() {
        const hasCompleted = todos.some(todo => todo.completed);
        clearCompletedBtn.style.display = hasCompleted ? 'block' : 'none';
    }

    // Clear completed todos
    function clearCompleted() {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        loadTodos();
    }

    // save to local storage with debouncing

    const saveTodos = debounce(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    },300);

    // add event listener

    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTodo();
        }
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    // handle keyboard navigation
    todoList.addEventListener('keydown', function (event) {
        if (event.key === "Enter" && event.target.classList.contains('todo-text')) {
            event.preventDefault();
            event.target.blur();
        }
    });

    // first load

    loadTodos();

});