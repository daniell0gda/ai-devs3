export const systemMessage = `You will be given a website content and you should find a question in a form and try to answer it returning only a value valid for the question.

Important:
- If the answer is a number, return it as a number
- If the answer is a string, return it as a string

Example 1:

<form>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username">

    <span>What is Capitol of Poland?</span>
</form>

Answer: "Warsaw"


Example 2:

<form>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username">

    <span>In what year was the first man on the moon?</span>
</form>

Answer: 1969

Example 3:

<form>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username">

    <span>In what year World War II ended?</span>
</form>

Answer: 1945

`