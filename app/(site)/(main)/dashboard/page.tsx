import LogOutButton from "@/components/LogoutButton"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Dashboard(){

    const session = await getServerSession(authOptions)

    if(!session?.user.id){
        redirect('/signup')
    }

    return(
        <div className="flex justify-center items-center space-x-10 min-h-screen">
            <p>{session?.user.username}</p>
            <LogOutButton/>
        </div>
    )
}