const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GitHub API configuration
const GITHUB_API_URL = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Optional: Set up in your .env file

// Create axios instance for GitHub API
const githubApi = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Accept: "application/vnd.github.v3+json",
    ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` }),
  },
});

// Helper to extract owner and repo from GitHub URL
const parseGitHubUrl = (url) => {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("github.com")) {
      return { valid: false };
    }

    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) {
      return { valid: false };
    }

    return {
      owner: pathParts[0],
      repo: pathParts[1],
      valid: true,
    };
  } catch (error) {
    return { valid: false };
  }
};

// Verify if a GitHub repository exists and is accessible
router.post("/verify", async (req, res) => {
  try {
    const { repoUrl } = req.body;
    const { owner, repo, valid } = parseGitHubUrl(repoUrl);

    if (!valid) {
      return res.status(400).json({ error: "Invalid GitHub repository URL" });
    }

    try {
      await githubApi.get(`/repos/${owner}/${repo}`);
      return res.json({ valid: true, owner, repo });
    } catch (error) {
      return res.status(404).json({
        error: "Repository not found or not accessible",
        message: error.response?.data?.message || "Unknown error",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get repository information (stars, forks, etc.)
router.get("/repository-info", async (req, res) => {
  try {
    const { url } = req.query;
    const { owner, repo, valid } = parseGitHubUrl(url);

    if (!valid) {
      return res.status(400).json({ error: "Invalid GitHub repository URL" });
    }

    try {
      const [repoResponse, languagesResponse] = await Promise.all([
        githubApi.get(`/repos/${owner}/${repo}`),
        githubApi.get(`/repos/${owner}/${repo}/languages`),
      ]);

      // Calculate language percentages
      const languages = languagesResponse.data;
      const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
      const languagePercentages = {};

      Object.entries(languages).forEach(([language, bytes]) => {
        languagePercentages[language] = Math.round((bytes / totalBytes) * 100);
      });

      const repoInfo = {
        name: repoResponse.data.name,
        description: repoResponse.data.description,
        stars: repoResponse.data.stargazers_count,
        forks: repoResponse.data.forks_count,
        issues: repoResponse.data.open_issues_count,
        languages: languagePercentages,
        url: repoResponse.data.html_url,
        homepage: repoResponse.data.homepage,
        createdAt: repoResponse.data.created_at,
        updatedAt: repoResponse.data.updated_at,
        defaultBranch: repoResponse.data.default_branch,
      };

      res.json(repoInfo);
    } catch (error) {
      return res.status(404).json({
        error: "Repository information not available",
        message: error.response?.data?.message || "Unknown error",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get commit history
router.get("/commits", async (req, res) => {
  try {
    const { url, limit = 10 } = req.query;
    const { owner, repo, valid } = parseGitHubUrl(url);

    if (!valid) {
      return res.status(400).json({ error: "Invalid GitHub repository URL" });
    }

    try {
      const commitsResponse = await githubApi.get(`/repos/${owner}/${repo}/commits`, {
        params: { per_page: limit },
      });

      const commits = commitsResponse.data.map((commit) => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.commit.author.name,
          email: commit.commit.author.email,
          date: commit.commit.author.date,
        },
        url: commit.html_url,
      }));

      res.json(commits);
    } catch (error) {
      return res.status(404).json({
        error: "Commit history not available",
        message: error.response?.data?.message || "Unknown error",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get languages used in repository
router.get("/languages", async (req, res) => {
  try {
    const { url } = req.query;
    const { owner, repo, valid } = parseGitHubUrl(url);

    if (!valid) {
      return res.status(400).json({ error: "Invalid GitHub repository URL" });
    }

    try {
      const languagesResponse = await githubApi.get(`/repos/${owner}/${repo}/languages`);
      const languages = languagesResponse.data;
      
      // Calculate percentages
      const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
      const languagePercentages = {};
      
      Object.entries(languages).forEach(([language, bytes]) => {
        languagePercentages[language] = {
          bytes,
          percentage: Math.round((bytes / totalBytes) * 100)
        };
      });
      
      res.json(languagePercentages);
    } catch (error) {
      return res.status(404).json({
        error: "Language information not available",
        message: error.response?.data?.message || "Unknown error",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get contributors
router.get("/contributors", async (req, res) => {
  try {
    const { url, limit = 10 } = req.query;
    const { owner, repo, valid } = parseGitHubUrl(url);

    if (!valid) {
      return res.status(400).json({ error: "Invalid GitHub repository URL" });
    }

    try {
      const contributorsResponse = await githubApi.get(`/repos/${owner}/${repo}/contributors`, {
        params: { per_page: limit },
      });

      const contributors = contributorsResponse.data.map((contributor) => ({
        username: contributor.login,
        id: contributor.id,
        contributions: contributor.contributions,
        profileUrl: contributor.html_url,
        avatarUrl: contributor.avatar_url,
      }));

      res.json(contributors);
    } catch (error) {
      return res.status(404).json({
        error: "Contributor information not available",
        message: error.response?.data?.message || "Unknown error",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Verify if a user owns a repository
router.post("/verify-ownership", authMiddleware, async (req, res) => {
  try {
    const { repoUrl, githubUsername } = req.body;
    const { owner, repo, valid } = parseGitHubUrl(repoUrl);

    if (!valid) {
      return res.status(400).json({ error: "Invalid GitHub repository URL" });
    }

    if (!githubUsername) {
      return res.status(400).json({ error: "GitHub username is required" });
    }

    try {
      // Get repository to check owner
      const repoResponse = await githubApi.get(`/repos/${owner}/${repo}`);
      
      const isOwner = repoResponse.data.owner.login.toLowerCase() === githubUsername.toLowerCase();
      
      if (isOwner) {
        return res.json({ isOwner: true });
      }
      
      // Check if user is a collaborator
      try {
        await githubApi.get(`/repos/${owner}/${repo}/collaborators/${githubUsername}`);
        return res.json({ isOwner: false, isCollaborator: true });
      } catch (collabError) {
        // 404 means not a collaborator
        if (collabError.response && collabError.response.status === 404) {
          return res.json({ isOwner: false, isCollaborator: false });
        }
        throw collabError;
      }
    } catch (error) {
      return res.status(404).json({
        error: "Repository verification failed",
        message: error.response?.data?.message || "Unknown error",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;