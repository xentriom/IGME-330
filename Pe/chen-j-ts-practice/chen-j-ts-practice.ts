// START CODE & Instructions

/*
  #1 - Create an interface that describes the structure of the item objects in the `todoItems` array
  Then strongly type the `todoItems` array
*/
interface TodoItem {
    id: number;
    title: string;
    status: TodoStatus;
    completedOn?: Date;
}

/*
  #2 - Strongly type the `status` property with an enum
  Note the `status` values below: "done", "in-progess" etc
*/
enum TodoStatus {
    DONE = "done",
    IN_PROGRESS = "in-progress",
    TODO = "todo"
}

const todoItems: TodoItem[] = [
    { id: 1, title: "Learn HTML", status: TodoStatus.DONE, completedOn: new Date("2021-09-11") },
    { id: 2, title: "Learn TypeScript", status: TodoStatus.IN_PROGRESS },
    { id: 3, title: "Write the best web app in the world", status: TodoStatus.TODO },
]

/*
  #3 - Strongly type the parameters and return values of `addTodoItem()` and `getNextId()`
*/
function addTodoItem(todo: string): TodoItem {
    const id = getNextId(todoItems)

    const newTodo: TodoItem = {
        id,
        title: todo,
        status: TodoStatus.TODO,
    }

    todoItems.push(newTodo)

    return newTodo
}

// **When you are done, there must not be any errors under the Playground's "Errors" tab**

// const todoItems = [
//     { id: 1, title: "Learn HTML", status: "done", completedOn: new Date("2021-09-11") },
//     { id: 2, title: "Learn TypeScript", status: "in-progress" },
//     { id: 3, title: "Write the best web app in the world", status: "todo" },
// ]

// function addTodoItem(todo) {
//     const id = getNextId(todoItems)

//     const newTodo = {
//         id,
//         title: todo,
//         status: "todo",
//     }

//     todoItems.push(newTodo)

//     return newTodo
// }

function getNextId(items: TodoItem[]): number {
    return items.reduce((max, x) => x.id > max ? x.id : max, 0) + 1;
}

const newTodo = addTodoItem("Buy lots of stuff with all the money we make from the app");

console.log(JSON.stringify(newTodo));