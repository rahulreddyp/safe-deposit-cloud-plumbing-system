import LexChat from "react-lex";

function ChatBot() {
        return (
            <LexChat
                botName="virtual_assistant"
                IdentityPoolId="us-east-1:b62dcab0-8aa4-43e6-99af-7d9682d06107"
                placeholder="Please type to get started"
                backgroundColor="#FFFFFF"
                height = "400px"
                region="us-east-1"
                headerText="Virtual Assistant"
                headerStyle={{ backgroundColor: "black", fontSize: "20px" }}
                greeting={
                    "Hello, how can I help? "
                }
            />
        );
    }
export default ChatBot