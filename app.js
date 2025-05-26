import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

app.use(express.static('public'));

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
// app.get("/post/:id", (req, res) => {
//     const post = posts.find(p => p.id === req.params.id);
//     if (post) {
//       res.render("post", {post});
//     } else {
//       res.status(404).send("Post not found");
//     }
//   });

  
  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
  


