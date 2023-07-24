import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import DashboardLayoutComponent from "./dashboardLayoutComponent"
import { cookies } from "next/headers";

export const revalidate = 5;

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const supabase = createServerComponentClient({ cookies });
    const {
        data: { session },
      } = await supabase.auth.getSession();
    
    let { data, error, status } = await supabase
        .from('cv_profile')
        .select('id, name')
        .eq('user_id', session?.user.id)
    if (error && status !== 406) {
        throw error
    }
        
    const parsedData = data?.map(obj => {
        return {
        id: obj.id,
        description: obj.name
    }})

    return (
        <DashboardLayoutComponent 
            user={session?.user ? session?.user : null} 
            profiles={parsedData ? parsedData : []} 
        >
            {children}
        </DashboardLayoutComponent>
    )
}

export default DashboardLayout;