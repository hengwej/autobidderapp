import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const {loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        !isAuthenticated && (
            <h3>
            <button onClick={() => loginWithRedirect()}>
                Sign In
            </button>
            Darren was here. Normal Email addr and password does not work cos Django isn't up
            :D
            </h3>
        )

    )
}

export default LoginButton