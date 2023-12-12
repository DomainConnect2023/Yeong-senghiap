import React, {
    createContext,
    Dispatch,
    ReactElement,
    ReactNode,
    SetStateAction,
    useContext,
    useState
} from "react";

type AuthContextType = {
    isSignedIn: boolean;
    setIsSignedIn: Dispatch<SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

const AuthProvider = (props: { children: ReactNode }): ReactElement => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    return <AuthContext.Provider {...props} value={{ isSignedIn, setIsSignedIn }} />;
};

export { AuthProvider, useAuth };