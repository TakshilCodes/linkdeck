
import GlassCard from "@/components/ui/GlassCard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import ProfileHeader from "./ProfileHeader";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function DashboardLinksPage() {

  const session = await getServerSession(authOptions);
  const userId = session?.user.id

  if(!userId){
    redirect('/signup')
  }

  const data = await prisma.user.findUnique({
    where:{
      id:userId
    },
    select:{
      displayName:true,
      username:true,
      bio:true,
      profileImgUrl:true,
      icons:true
    }
  })

  return (
    <div>
      <p className="p-5 border-b bg-[#07101C] border-[#202833] text-2xl">Links</p>

      <GlassCard className="m-10"> 
      <div>
        <ProfileHeader username={data?.username!} bio={data?.bio!} profileImgUrl={data?.profileImgUrl!} icons={data?.icons!} displayName={data?.displayName!}/>
      </div>
    </GlassCard>
    </div>
  );
}