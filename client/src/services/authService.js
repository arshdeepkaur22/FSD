// This file defines the GitHub service for frontend components to use
// It relies on backend API calls for security to avoid exposing tokens
import { githubApi } from './api';

class GitHubService {
  /**
   * Verifies if a GitHub repository URL is valid and accessible
   * @param {string} repoUrl GitHub repository URL
   * @returns {Promise<Object>} Verification result
   */
  static async verifyRepository(repoUrl) {
    try {
      const response = await githubApi.verifyRepository(repoUrl);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to verify repository'
      };
    }
  }

  /**
   * Fetches repository information including stars, forks, contributors etc.
   * @param {string} repoUrl - Full GitHub repository URL
   * @returns {Promise<Object>} Repository information
   */
  static async getRepositoryInfo(repoUrl) {
    try {
      const response = await githubApi.getRepositoryInfo(repoUrl);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch repository data'
      };
    }
  }

  /**
   * Fetches commit history for a repository
   * @param {string} repoUrl - Full GitHub repository URL
   * @returns {Promise<Object>} Commit history
   */
  static async getCommitHistory(repoUrl) {
    try {
      const response = await githubApi.getCommitHistory(repoUrl);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch commit history'
      };
    }
  }

  /**
   * Fetches repository languages and their usage percentages
   * @param {string} repoUrl - Full GitHub repository URL
   * @returns {Promise<Object>} Languages and percentages
   */
  static async getLanguages(repoUrl) {
    try {
      const response = await githubApi.getLanguages(repoUrl);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch repository languages'
      };
    }
  }

  /**
   * Fetches contributors and their statistics
   * @param {string} repoUrl - Full GitHub repository URL
   * @returns {Promise<Object>} Contributors data
   */
  static async getContributors(repoUrl) {
    try {
      const response = await githubApi.getContributors(repoUrl);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch contributors'
      };
    }
  }

  /**
   * Extract owner and repo name from GitHub URL
   * @param {string} url GitHub repository URL
   * @returns {Object} Object containing owner and repo
   */
  static parseGitHubUrl(url) {
    try {
      // Remove trailing slash if present
      const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      // Extract owner and repo
      const urlParts = cleanUrl.replace('https://github.com/', '').split('/');
      return {
        owner: urlParts[0],
        repo: urlParts[1],
        valid: urlParts.length >= 2 && urlParts[0] && urlParts[1]
      };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Returns direct link to repository's README file
   * @param {string} repoUrl GitHub repository URL
   * @returns {string} README URL
   */
  static getReadmeUrl(repoUrl) {
    const { owner, repo, valid } = this.parseGitHubUrl(repoUrl);
    if (!valid) return null;
    return `https://github.com/${owner}/${repo}/blob/main/README.md`;
  }

  /**
   * Creates a repository badge image URL
   * @param {string} repoUrl GitHub repository URL
   * @param {string} type Badge type ('stars', 'forks', 'issues')
   * @returns {string} Badge image URL
   */
  static getBadgeUrl(repoUrl, type = 'stars') {
    const { owner, repo, valid } = this.parseGitHubUrl(repoUrl);
    if (!valid) return null;
    
    return `https://img.shields.io/github/${type}/${owner}/${repo}?style=flat-square`;
  }
}

export default GitHubService;