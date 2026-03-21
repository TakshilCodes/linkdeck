import EnterUsernameStep from "./EnterUsernameStep";

export default async function OnBoarding(props: PageProps<"/onboarding">) {

    const params = await props.searchParams;

    const step = params.step


    return (
        <main className='relative min-h-screen overflow-hidden'>

            <div className='relative z-10 flex min-h-screen items-center justify-center px-4'>

                {step === "username" ? <EnterUsernameStep /> : null}
            </div>
        </main>
    )
}