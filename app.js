import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios"; 

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postsFile = path.join(__dirname, "posts.json");

function loadPosts(){
  const data = fs.readFileSync(postsFile, "utf-8");
  return JSON.parse(data);
}

// function savePosts(posts) {
//   fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), 'utf-8');
// }

let posts = loadPosts();
setInterval(() => {
  posts = loadPosts();
}, 300000);

app.set("view engine", "ejs");

console.log("Static folder path:", path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) =>{
    const query = req.query.q?.toLowerCase() || "";

      const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) 
    );
    res.render("index", {posts:filteredPosts, query});
});


  // View individual post
app.get("/post/:id", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);

  if (!post) {
      return res.status(404).send("Post not found");
  }

  const htmlPath = path.join(__dirname, "public", post.content);

  fs.readFile(htmlPath, "utf-8", (err, content) => {
      if (err) {
          console.error("Error reading HTML content:", err);
          return res.status(500).send("Error loading post content");
      }

      res.render("post", { post, htmlContent: content });
  });
});

//Riddles

app.get("/api/riddle", async(req, res) =>{
  try {
    const response = await axios.get("https://riddles-api.vercel.app/random"); 
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching riddle");
  }
});

app.get("/riddles", async (req, res) => {
  try{
    const response = await axios.get("https://riddles-api.vercel.app/random");
    const riddle = response.data;
    res.render("riddles", {riddle});
  }catch (error){
    console.error("Error loading riddle:", error);
    res.status(500).send("Error loading riddle page");
  }
});
  
  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
  


