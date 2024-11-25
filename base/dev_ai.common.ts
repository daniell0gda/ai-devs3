export async function post_response<T = any>(task:string, answer:unknown){
    try {

        const response = await fetch("https://centrala.ag3nts.org/report", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "task": task,
                "apikey": "ebb8d796-e6a2-44bc-8109-e71eddbdf06c",
                "answer": answer
            })
        });

        console.log('Response success ', response.status == 200);

        let responseData = await response.json() as T;

        console.log("response text:", responseData);

        return responseData;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
