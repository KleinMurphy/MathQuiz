// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Felix {
    uint256 public num1;
    uint256 public num2;
    uint256 public operator;  // 0 for addition, 1 for subtraction
    uint256 public correctAnswer;
    string public emoji;

    event NewQuestion(uint256 _num1, uint256 _num2, uint256 _operator, uint256 _correctAnswer, string _emoji);

    constructor() {
        generateQuestion();
    }

    function generateQuestion() public {
        num1 = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % 90 + 10; // Random two-digit number
        num2 = uint256(keccak256(abi.encodePacked(block.gaslimit, block.number))) % 90 + 10; // Random two-digit number
        operator = uint256(keccak256(abi.encodePacked(block.coinbase, block.timestamp))) % 2; // Random operator (0 for addition, 1 for subtraction)
        if (operator == 0) {
            correctAnswer = num1 + num2;
        } else {
            correctAnswer = num1 - num2;
        }
        emoji = getRandomEmoji();
        emit NewQuestion(num1, num2, operator, correctAnswer, emoji);
    }

    function getRandomEmoji() internal view returns (string memory) {
        string[] memory emojiList = new string[](3); // Create an array of possible emoji
        emojiList[0] = "\xf0\x9f\x98\x83";
        emojiList[1] = "\xf0\x9f\xa5\xb3";
        emojiList[2] = "\xf0\x9f\x8e\x89";
        
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp))) % emojiList.length; // Generate a random index
        string memory selectedEmoji = emojiList[randomIndex]; // Select an emoji
        return selectedEmoji; // Return the selected emoji
    }

    function checkAnswer(uint256 answer) public {
        if (answer == correctAnswer) {
            // User answered correctly, display the random emoji
            emit NewQuestion(num1, num2, operator, correctAnswer, emoji);
        } else {
            // User answered incorrectly, do nothing
        }
        generateQuestion();
    }
}
