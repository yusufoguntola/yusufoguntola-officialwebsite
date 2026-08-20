import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Experience from "./pages/Experience.jsx";
import LearningResources from "./pages/LearningResources.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import Press from "./pages/Press.jsx";
import NotFound from "./pages/NotFound.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="experience" element={<Experience />} />
          <Route path="learning" element={<LearningResources />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="press" element={<Press />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
