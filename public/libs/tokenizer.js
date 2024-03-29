/* Initializes the tokenizer, gets literals,
 * makes call to parse/eval for the program
 * @ param args            {string}
*/
//Read the whole program into a single string
// Kill the newlines check
// Replace all literals with “RESERVEDWORD”<the literal>”RESERVEDWORD”
// Replace all RESERVEDWORDRESERVEDWORD with just “RESERVEDWORD”
// Split on “RESERVEDWORD”

var fs = require("fs");

let _tokenizer = null;
export default class Tokenizer {
    //this.Tokenizer.theTokenizer;

    constructor(literals, filename) {
        this.currentToken = 0;
        this.literals = literals;
        this.filename = filename;
        try {
          console.log("tokenizer.js, attempting to find input file");
          this.program = fs.readFileSync(this.filename,'utf8');
          console.log("tokenizer.js, found input file: " + this.filename);

        } catch (e) {
          console.log("Didn't find file");
          process.exit(0);
        }
        this.spaceKillingTokenize();
    }


    spaceKillingTokenize(){
      console.log("beginning space killing tokenize");
      function name(str,replaceWhat,replaceTo){
        var re = new RegExp(replaceWhat, 'g');
        return str.replace(re,replaceTo);
        }

      this.tokenizedProgram = this.program;
      this.tokenizedProgram = this.tokenizedProgram.replace(/\n/g,"");
      this.tokenizedProgram = this.tokenizedProgram.replace(/ /g,"");

      var RW = "@@" //RESERVEDWORD
      for(var i=0;i<this.literals.length;i++){
        var token = this.literals[i]
        this.tokenizedProgram = name(this.tokenizedProgram,token,`${RW}${token}${RW}`)
      }
      this.tokenizedProgram = name(this.tokenizedProgram,`${RW}${RW}`,`${RW}`)
      this.tokenizedProgram = this.tokenizedProgram.split(`${RW}`)
      this.tokens = this.tokenizedProgram;
      this.tokens.shift()
      console.log(this.tokens);
    }

    checkNext(){
      var token = "";
      if (this.currentToken<this.tokens.length){
        token = this.tokens[this.currentToken];
      }
      else {
        token = "NO_MORE_TOKENS";
      }
      return token;
    }

    getNext(){
      var token = "";
      if (this.currentToken<this.tokens.length){
        token = this.tokens[this.currentToken];
        this.currentToken++;
        //console.log("the next token gotten is: " + token);
      }
      else{
        token="NULLTOKEN";
      }
    return token;
    }

    checkToken(regexp){
      var s = this.checkNext();
      console.log(`comparing: ${s} to ${regexp}`);
      return s==regexp;

    }

    getAndCheckNext(regexp){
      console.log("tokenizer.js getAndCheckNext of " + regexp);
      var s = this.getNext();
      if (!s==regexp){
        process.exit(0);
      }
      console.log(`matched: ${s} to ${regexp}`);
      return s
    }

    moreTokens(){
        return this.currentToken<this.tokens.length;
    }

    // makeTokenizer(filename, literals){
    //     if (this.theTokenizer==null){
    //       this.theTokenizer = new Tokenizer(filename,literals);
    //     }
    // }

    static makeTokenizer(literals, filename){
        if (_tokenizer == null){
          _tokenizer = new Tokenizer(literals, filename);
          //console.log(JSON.stringify(_tokenizer));
        }
    }

    // getTokenizer(){
    //       return this.theTokenizer;
    //     }

    static getTokenizer(){
        return _tokenizer;
    }

}
