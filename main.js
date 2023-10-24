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
        contractWithSigner.generateQuestion();
        num1 = await contract.num1();
        num2 = await contract.num2();
        operator = await contract.operator();
        correctAnswer = await contract.correctAnswer();
        emoji = await contract.emoji();
        console.log(num1, num2, operator, correctAnswer, emoji);

        const questionElement = document.getElementById("question");
        questionElement.textContent = `${num1} ${operator === 0 ? '+' : '-'} ${num2} = ?`;

        const resultElement = document.getElementById("result");
        resultElement.textContent = "";
        const emojiElement = document.getElementById("emoji");
        emojiElement.textContent = "";
        
    }

    contract.on("NewQuestion", (num1, num2, operator, correctAnswer, emoji) => {
        const questionElement = document.getElementById("question");
        questionElement.textContent = `${num1} ${operator === 0 ? '+' : '-'} ${num2} = ?`;

        const resultElement = document.getElementById("result");
        resultElement.textContent = "";
        const emojiElement = document.getElementById("emoji");
        emojiElement.textContent = "";
        console.log(num1, num2, operator, correctAnswer, emoji);
    })

    function checkAnswer() {
        const answerInput = document.getElementById("answer");
        const userAnswer = parseInt(answerInput.value, 10);

        const resultElement = document.getElementById("result");
        const emojiElement = document.getElementById("emoji");

        if (userAnswer === correctAnswer) {
            resultElement.textContent = "Correct! 🎉";
            emojiElement.textContent = emoji;
        } else {
            resultElement.textContent = "Incorrect. Try again.";
            emojiElement.textContent = "";
        }

        // Load the next question
        loadQuestion();
    }
}