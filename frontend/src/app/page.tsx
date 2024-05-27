import Image from "next/image";
import styles from "./page.module.css";
import { getAllUsers, GetUserWithTodosById } from "./lib/user/user.method";
import { log } from "console";

export default async function Home() {
  const rqAllUsers = await getAllUsers()
  const {allUsers} = rqAllUsers
  console.log(allUsers)


  const rqAllUsersByTodo = await GetUserWithTodosById(2)
  const {userWithTodosById} = rqAllUsersByTodo.user
  console.log("toto", userWithTodosById)


  return (
    <main >
      <div>
        {userWithTodosById.todos.map(
          (todo: any)=>(
            <div>
            {todo.description}
            </div>
          )
        )}
      </div>
    </main>
  );
}
