
import AstNode from "../libs/astNode.js";
import Post from "./post";
import MeBlock from "./meBlock.js";
import Format from "./format.js";
import { format } from "util";
export default class Program extends AstNode {

    constructor() {
        console.log("calling super");
        super();
        this.blogItems = [];
        this.blogType = "";
        this.blogName = "";
        this.tokenizer = AstNode.nodeTokenizer();
        this.fs = AstNode.nodeFs();
        console.log(AstNode.nodeTokenizer());
    }

    parse() {
        console.log("program.js, beginning parsing");
        this.tokenizer.getAndCheckNext("Create");
        this.blogType = this.tokenizer.getNext();
        this.blogName = this.tokenizer.getNext();

        console.log("Blog type: " + this.blogType);
        console.log("Blog name: " + this.blogName);

        this.tokenizer.getAndCheckNext(":");

        if (this.tokenizer.checkToken("Format")) {
            this.blogFormat = new Format(".globalFormat");
            this.blogFormat.parse();
        } else {
            console.log("Blog Format not found");
            process.exit(0);
        }

        if (this.tokenizer.checkToken("Aboutme")) {
            var meBlock = new MeBlock();
            meBlock.parse();
            this.blogItems.push(meBlock);
        } else {
            console.log("MeBlock (About me) not found");
            process.exit(0);
        }

        while(!this.tokenizer.checkNext("Donefornow")) {
            var post = null;

            if (this.tokenizer.checkNext("Post")) {
                post = new Post();
                post.parse(this.blogType);
                this.blogItems.push(post);
            }
        }
    }

    evaluate() {
        AstNode.addToNames(this.blogName);
        var htmlBeginning = `<!DOCTYPE html>
                            <html>
                            <meta name="viewport" content = "width=device-width, initial-scale=1">
                            <body>
                            <div class="blogTitle">
                                <h2>${this.blogName}</h2>
                            </div>`;
        var htmlEnding = `</body>
                            </html>`;

        this.fs.appendFileSync("output.html", htmlBeginning);

        //creating a css file for format if not existing already
        this.fs.appendFileSync("output.css", "");
        this.blogFormat.evaluate();

        var itemLength = this.blogItems.length;
        for (var i = 0; i < itemLength; i++) {
            this.blogItems[i].evaluate();
        }

        this.fs.appendFileSync("output.html", htmlEnding);
    }
}
