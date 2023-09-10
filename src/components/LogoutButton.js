import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
    const {logout, isAuthenticated } = useAuth0();

    return (
        isAuthenticated && (

            <h3>
            <button onClick={() => logout()}>
                Sign Out
            </button>
            The sign out button works. Please help to test</h3>
        )

    )
}

export default LogoutButton