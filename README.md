This is a simple yet dynamic To-Do List web app built using Vanilla JavaScript, HTML, and CSS. It offers a clean user interface, persistent storage via localStorage, mobile touch gestures (like swipe-to-delete), and supports live editing, animations, and keyboard accessibility. It's a great example of a minimal yet feature-rich front-end project without relying on any frameworks or libraries.

 Features
 Add, edit, and delete todos

 Mark todos as completed with a checkbox

 Smooth animations for adding/removing items

 Persists data using localStorage

 Clear completed todos with one click

 Touch support (swipe down to delete on mobile)

 Debounced saving for performance

 Keyboard support for accessibility

 Mobile vibration feedback on adding tasks

  How It Works
Initialization
On page load (DOMContentLoaded), the app reads todos from localStorage.

Renders them with animation using loadTodos().

Adding Todos
User types in an input box and clicks "Add" or presses Enter.

A new todo is created and saved to the todos array.

Editing Todos
Todo text is contenteditable.

Completion Toggle
Checkbox toggles a todo between completed and active states.

UI updates immediately and saves to localStorage.

Deleting Todos
Can be deleted by clicking the bin icon or swiping vertically on mobile.

Triggers a fade-out animation before removing the item.

Clear Completed
A "Clear Completed" button appears only if there are completed items.

On click, it removes all completed todos from the list.

Persistence
All todos are saved in localStorage using a debounced saveTodos() function for performance.

 Touch Support
Swipe gesture is implemented using touchstart, touchmove, and touchend.
If swipe distance exceeds a threshold, the todo is deleted.

