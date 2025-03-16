import { useEffect } from "react"

interface message {
    _id: string,
    content: string,
    sendAt: Date
}


const useRecentChats = (email: string) => {
    useEffect(() => {
        const fetchData = async () => {
            const url = `${process.env.REACT_APP_API_URL}/api/v1/message?${email}`
            try {



                const response = await fetch(url, {
                    method: "GET"
                })

                if (!response.ok) {
                    throw new Error(`Error in getting message`);
                }


                const data = await response.json()
                const recentMessages = data.recentMessages
                console.log(typeof recentMessages)
                return recentMessages



            } catch (e) {
                console.log("Some errors happen", e)
                return []
            }
        };

        fetchData();
    }, []); // Dependency array: fetch when `email` changes

}





export default useRecentChats