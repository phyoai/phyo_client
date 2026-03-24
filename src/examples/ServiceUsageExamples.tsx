// @ts-nocheck
/**
 * Complete Service Usage Examples
 * Demonstrates how to use all 118+ API endpoints across services
 * Location: src/examples/ServiceUsageExamples.tsx
 */

import React, { useEffect, useState } from 'react';

// ============================================================================
// CONVERSATION SERVICE EXAMPLES
// ============================================================================
import { ConversationService, IConversation } from '@/services';

export const ConversationServiceExamples = () => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(false);

  // Get all conversations
  const handleGetConversations = async () => {
    setLoading(true);
    try {
      const response = await ConversationService.getConversations();
      setConversations(response.data);
      console.log('✅ Conversations fetched:', response.data);
    } catch (error) {
      console.error('❌ Failed to fetch conversations', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new conversation
  const handleCreateConversation = async (participantId: string) => {
    try {
      const response = await ConversationService.createConversation({
        participantId,
      });
      console.log('✅ Conversation created:', response.data);
      handleGetConversations(); // Refresh list
    } catch (error) {
      console.error('❌ Failed to create conversation', error);
    }
  };

  // Get specific conversation
  const handleGetConversationById = async (conversationId: string) => {
    try {
      const response = await ConversationService.getConversationById(
        conversationId
      );
      console.log('✅ Conversation details:', response.data);
    } catch (error) {
      console.error('❌ Failed to get conversation', error);
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (conversationId: string) => {
    try {
      const response = await ConversationService.deleteConversation(
        conversationId
      );
      console.log('✅ Conversation deleted:', response.message);
      handleGetConversations(); // Refresh list
    } catch (error) {
      console.error('❌ Failed to delete conversation', error);
    }
  };

  useEffect(() => {
    handleGetConversations();
  }, []);

  return (
    <div className="p-4">
      <h2>Conversation Service Examples</h2>
      <button onClick={handleGetConversations}>Load Conversations</button>
      <button onClick={() => handleCreateConversation('user-id-123')}>
        Create Conversation
      </button>
      {loading && <p>Loading...</p>}
      <ul>
        {conversations.map((conv) => (
          <li key={conv._id}>
            {conv._id}
            <button onClick={() => handleGetConversationById(conv._id)}>
              View
            </button>
            <button onClick={() => handleDeleteConversation(conv._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// PORTFOLIO SERVICE EXAMPLES
// ============================================================================
import {
  PortfolioService,
  IPortfolio,
  CreatePortfolioPayload,
  CreateClientPayload,
} from '@/services';

export const PortfolioServiceExamples = () => {
  const [portfolios, setPortfolios] = useState<IPortfolio[]>([]);
  const [loading, setLoading] = useState(false);

  // Create portfolio
  const handleCreatePortfolio = async () => {
    const payload: CreatePortfolioPayload = {
      title: 'My Portfolio',
      description: 'Professional portfolio showcasing my work',
    };

    try {
      const response = await PortfolioService.createPortfolio(payload);
      console.log('✅ Portfolio created:', response.data);
      handleGetPortfolios(); // Refresh
    } catch (error) {
      console.error('❌ Failed to create portfolio', error);
    }
  };

  // Get all portfolios
  const handleGetPortfolios = async () => {
    setLoading(true);
    try {
      const response = await PortfolioService.getPortfolios(1, 10);
      setPortfolios(response.data.data);
      console.log('✅ Portfolios fetched:', response.data);
    } catch (error) {
      console.error('❌ Failed to fetch portfolios', error);
    } finally {
      setLoading(false);
    }
  };

  // Get specific portfolio
  const handleGetPortfolioById = async (portfolioId: string) => {
    try {
      const response = await PortfolioService.getPortfolioById(portfolioId);
      console.log('✅ Portfolio details:', response.data);
    } catch (error) {
      console.error('❌ Failed to get portfolio', error);
    }
  };

  // Update portfolio
  const handleUpdatePortfolio = async (portfolioId: string) => {
    try {
      const response = await PortfolioService.updatePortfolio(portfolioId, {
        title: 'Updated Portfolio Title',
      });
      console.log('✅ Portfolio updated:', response.data);
      handleGetPortfolios(); // Refresh
    } catch (error) {
      console.error('❌ Failed to update portfolio', error);
    }
  };

  // Add client to portfolio
  const handleAddClient = async (portfolioId: string) => {
    const payload: CreateClientPayload = {
      projectTitle: 'E-commerce Website',
      clientName: 'ABC Corporation',
      servicesProvided: ['Web Design', 'Development'],
      budget: 5000,
      projectStatus: 'Completed',
      startDate: '2024-01-01',
      endDate: '2024-03-01',
    };

    try {
      const response = await PortfolioService.addClient(portfolioId, payload);
      console.log('✅ Client added:', response.data);
      handleGetPortfolioById(portfolioId); // Refresh
    } catch (error) {
      console.error('❌ Failed to add client', error);
    }
  };

  // Update client
  const handleUpdateClient = async (
    portfolioId: string,
    clientId: string
  ) => {
    try {
      const response = await PortfolioService.updateClient(
        portfolioId,
        clientId,
        { projectTitle: 'Updated Project Title' }
      );
      console.log('✅ Client updated:', response.data);
    } catch (error) {
      console.error('❌ Failed to update client', error);
    }
  };

  // Remove client
  const handleRemoveClient = async (
    portfolioId: string,
    clientId: string
  ) => {
    try {
      const response = await PortfolioService.removeClient(
        portfolioId,
        clientId
      );
      console.log('✅ Client removed:', response.message);
    } catch (error) {
      console.error('❌ Failed to remove client', error);
    }
  };

  // Get portfolio stats
  const handleGetPortfolioStats = async (portfolioId: string) => {
    try {
      const response = await PortfolioService.getPortfolioStats(portfolioId);
      console.log('✅ Portfolio stats:', response.data);
    } catch (error) {
      console.error('❌ Failed to get portfolio stats', error);
    }
  };

  // Delete portfolio
  const handleDeletePortfolio = async (portfolioId: string) => {
    try {
      const response = await PortfolioService.deletePortfolio(portfolioId);
      console.log('✅ Portfolio deleted:', response.message);
      handleGetPortfolios(); // Refresh
    } catch (error) {
      console.error('❌ Failed to delete portfolio', error);
    }
  };

  useEffect(() => {
    handleGetPortfolios();
  }, []);

  return (
    <div className="p-4">
      <h2>Portfolio Service Examples (9 endpoints)</h2>
      <button onClick={handleCreatePortfolio}>Create Portfolio</button>
      <button onClick={handleGetPortfolios}>Load Portfolios</button>
      {loading && <p>Loading...</p>}
      <ul>
        {portfolios.map((portfolio) => (
          <li key={portfolio._id}>
            {portfolio.title}
            <button onClick={() => handleGetPortfolioById(portfolio._id)}>
              View
            </button>
            <button onClick={() => handleUpdatePortfolio(portfolio._id)}>
              Edit
            </button>
            <button onClick={() => handleAddClient(portfolio._id)}>
              Add Client
            </button>
            <button onClick={() => handleGetPortfolioStats(portfolio._id)}>
              Stats
            </button>
            <button onClick={() => handleDeletePortfolio(portfolio._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// PROJECT SERVICE EXAMPLES
// ============================================================================
import { ProjectService, IProject, CreateProjectPayload } from '@/services';

export const ProjectServiceExamples = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);

  // Create project
  const handleCreateProject = async () => {
    const payload: CreateProjectPayload = {
      name: 'Mobile App Development',
      description: 'Build a React Native mobile application',
      progressPercentage: 0,
      date: new Date().toISOString(),
      status: 'In Progress',
    };

    try {
      const response = await ProjectService.createProject(payload);
      console.log('✅ Project created:', response.data);
      handleGetProjects(); // Refresh
    } catch (error) {
      console.error('❌ Failed to create project', error);
    }
  };

  // Get all projects
  const handleGetProjects = async () => {
    setLoading(true);
    try {
      const response = await ProjectService.getProjects({ status: 'In Progress' }, 1, 10);
      setProjects(response.data.data);
      console.log('✅ Projects fetched:', response.data);
    } catch (error) {
      console.error('❌ Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  // Get project by ID
  const handleGetProjectById = async (projectId: string) => {
    try {
      const response = await ProjectService.getProjectById(projectId);
      console.log('✅ Project details:', response.data);
    } catch (error) {
      console.error('❌ Failed to get project', error);
    }
  };

  // Update project
  const handleUpdateProject = async (projectId: string) => {
    try {
      const response = await ProjectService.updateProject(projectId, {
        progressPercentage: 50,
        status: 'Completed',
      });
      console.log('✅ Project updated:', response.data);
      handleGetProjects(); // Refresh
    } catch (error) {
      console.error('❌ Failed to update project', error);
    }
  };

  // Get project stats
  const handleGetProjectStats = async () => {
    try {
      const response = await ProjectService.getProjectStats();
      console.log('✅ Project stats:', response.data);
    } catch (error) {
      console.error('❌ Failed to get project stats', error);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await ProjectService.deleteProject(projectId);
      console.log('✅ Project deleted:', response.message);
      handleGetProjects(); // Refresh
    } catch (error) {
      console.error('❌ Failed to delete project', error);
    }
  };

  useEffect(() => {
    handleGetProjects();
  }, []);

  return (
    <div className="p-4">
      <h2>Project Service Examples (6 endpoints)</h2>
      <button onClick={handleCreateProject}>Create Project</button>
      <button onClick={handleGetProjects}>Load Projects</button>
      <button onClick={handleGetProjectStats}>Get Stats</button>
      {loading && <p>Loading...</p>}
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            {project.name} - {project.progressPercentage}%
            <button onClick={() => handleGetProjectById(project._id)}>
              View
            </button>
            <button onClick={() => handleUpdateProject(project._id)}>
              Update
            </button>
            <button onClick={() => handleDeleteProject(project._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// FILE UPLOAD SERVICE EXAMPLES
// ============================================================================
import { FileUploadService } from '@/services';

export const FileUploadServiceExamples = () => {
  const [uploading, setUploading] = useState(false);

  // Upload file
  const handleUploadFile = async (file: File) => {
    setUploading(true);
    try {
      const response = await FileUploadService.uploadFile(file);
      console.log('✅ File uploaded:', response.data);
      alert(`File uploaded: ${response.data.url}`);
    } catch (error) {
      console.error('❌ Failed to upload file', error);
    } finally {
      setUploading(false);
    }
  };

  // Delete file
  const handleDeleteFile = async (fileKey: string) => {
    try {
      const response = await FileUploadService.deleteFile(fileKey);
      console.log('✅ File deleted:', response.message);
    } catch (error) {
      console.error('❌ Failed to delete file', error);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-4">
      <h2>File Upload Service Examples (2 endpoints)</h2>
      <input
        type="file"
        onChange={onFileSelect}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      <button onClick={() => handleDeleteFile('file-key-123')}>
        Delete File
      </button>
    </div>
  );
};

// ============================================================================
// TRENDING SERVICE EXAMPLES
// ============================================================================
import { TrendingService } from '@/services';

export const TrendingServiceExamples = () => {
  const [loading, setLoading] = useState(false);

  // Get trending influencers
  const handleGetTrendingInfluencers = async () => {
    setLoading(true);
    try {
      const response = await TrendingService.getTrendingInfluencers(20, 0);
      console.log('✅ Trending influencers:', response.data);
    } catch (error) {
      console.error('❌ Failed to get trending influencers', error);
    } finally {
      setLoading(false);
    }
  };

  // Get trending campaigns
  const handleGetTrendingCampaigns = async () => {
    setLoading(true);
    try {
      const response = await TrendingService.getTrendingCampaigns(6, 0);
      console.log('✅ Trending campaigns:', response.data);
    } catch (error) {
      console.error('❌ Failed to get trending campaigns', error);
    } finally {
      setLoading(false);
    }
  };

  // Get trending brands
  const handleGetTrendingBrands = async () => {
    setLoading(true);
    try {
      const response = await TrendingService.getTrendingBrands(8, 0);
      console.log('✅ Trending brands:', response.data);
    } catch (error) {
      console.error('❌ Failed to get trending brands', error);
    } finally {
      setLoading(false);
    }
  };

  // Get trending categories
  const handleGetTrendingCategories = async () => {
    setLoading(true);
    try {
      const response = await TrendingService.getTrendingCategories();
      console.log('✅ Trending categories:', response.data);
    } catch (error) {
      console.error('❌ Failed to get trending categories', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2>Trending Service Examples (4 endpoints)</h2>
      <button onClick={handleGetTrendingInfluencers}>
        Trending Influencers
      </button>
      <button onClick={handleGetTrendingCampaigns}>
        Trending Campaigns
      </button>
      <button onClick={handleGetTrendingBrands}>Trending Brands</button>
      <button onClick={handleGetTrendingCategories}>
        Trending Categories
      </button>
      {loading && <p>Loading...</p>}
    </div>
  );
};

// ============================================================================
// AI SEARCH SERVICE EXAMPLES
// ============================================================================
import { AISearchService } from '@/services';

export const AISearchServiceExamples = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Search influencers with AI
  const handleSearchInfluencers = async (prompt: string) => {
    setLoading(true);
    try {
      const response = await AISearchService.searchInfluencers(prompt);
      setResults(response.data.data);
      console.log('✅ Search results:', response.data);
    } catch (error) {
      console.error('❌ Failed to search influencers', error);
    } finally {
      setLoading(false);
    }
  };

  // Get influencer details
  const handleGetInfluencerDetails = async (userName: string) => {
    try {
      const response = await AISearchService.getInfluencerDetails(userName);
      console.log('✅ Influencer details:', response.data);
    } catch (error) {
      console.error('❌ Failed to get influencer details', error);
    }
  };

  // Get debug info
  const handleGetDebugInfo = async () => {
    try {
      const response = await AISearchService.getDebugInfo();
      console.log('✅ Debug info:', response.data);
    } catch (error) {
      console.error('❌ Failed to get debug info', error);
    }
  };

  return (
    <div className="p-4">
      <h2>AI Search Service Examples (3 endpoints)</h2>
      <input
        type="text"
        placeholder="Search influencers (e.g., 'fashion influencers')"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearchInfluencers((e.target as HTMLInputElement).value);
          }
        }}
      />
      <button onClick={handleGetDebugInfo}>Debug Info</button>
      {loading && <p>Searching...</p>}
      <ul>
        {results.map((result) => (
          <li key={result._id}>
            {result.name}
            <button
              onClick={() =>
                handleGetInfluencerDetails(result.userName || result.name)
              }
            >
              Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// MAIN EXAMPLES COMPONENT
// ============================================================================
export const AllServiceUsageExamples = () => {
  return (
    <div className="space-y-8 p-8">
      <h1>Complete API Service Usage Examples</h1>
      <p>All 28 new service methods demonstrated below</p>

      <ConversationServiceExamples />
      <PortfolioServiceExamples />
      <ProjectServiceExamples />
      <FileUploadServiceExamples />
      <TrendingServiceExamples />
      <AISearchServiceExamples />
    </div>
  );
};

export default AllServiceUsageExamples;
