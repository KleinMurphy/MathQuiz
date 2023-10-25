let contract;
let signer;
let contractWithSigner;
let num1, num2, operator, correctAnswer, emoji;

main();

async function main() {
    // Basic setup code required for all the web pages that interact with MetaMask and the Ethereum blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    contractWithSigner = contract.connect(signer);

    // Load the initial question when the page loads
    loadQuestion();


    async function loadQuestion() {
        
        num1 = await contract.num1();
        num2 = await contract.num2();
        operator = await contract.operator();
        operator = Number(operator);
        correctAnswer = await contract.correctAnswer();
        correctAnswer = Number(correctAnswer);
        console.log(correctAnswer);
        emoji = await contract.emoji();
        console.log(num1, num2, operator, correctAnswer, emoji);

        const questionElement = document.getElementById("question");
        questionElement.textContent = `${num1} ${operator === 0 ? '+' : '-'} ${num2} = ?`;

        const resultElement = document.getElementById("result");
        resultElement.textContent = "";
        const emojiElement = document.getElementById("emoji");
        emojiElement.textContent = "";
    }

    // stuff that happens when the user clicks the Submit Answer button
        const buttonElement = document.getElementById("SubmitAnswer");
        buttonElement.addEventListener("click", function() {

            // the function body for the event listener

            checkAnswer();

        })

    // when  the transaction is successful, this event will trigger
    contract.on("NewQuestion", (num1, num2, operator, correctAnswer, emoji) => {
        // const questionElement = document.getElementById("question");
        // questionElement.textContent = `${num1} ${operator === 0 ? '+' : '-'} ${num2} = ?`;

        // const resultElement = document.getElementById("result");
        // resultElement.textContent = "";
        // const emojiElement = document.getElementById("emoji");
        // emojiElement.textContent = "";
        // console.log(num1, num2, operator, correctAnswer, emoji);

        loadQuestion();
    })

    function checkAnswer() {
        const answerInput = document.getElementById("answer");
        const userAnswer = parseInt(answerInput.value, 10);
        console.log(userAnswer);

        const resultElement = document.getElementById("result");
        const emojiElement = document.getElementById("emoji");

        if (userAnswer === correctAnswer) {
            resultElement.textContent = "Correct! 🎉";
            emojiElement.textContent = emoji;
        } else {
            resultElement.textContent = "Incorrect. Try again.";
            emojiElement.textContent = "";
        }

        // Generate the next question
        contractWithSigner.generateQuestion();
    }
}