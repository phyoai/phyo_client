'use client';

import React, { useEffect, useState } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ClientForm from './ClientForm';

/**
 * Client List Component (TIER 4)
 * List all clients with filtering and edit/delete actions
 */
const ClientList = () => {
  const {
    portfolioItems,
    loading,
    error,
    fetchPortfolioItems,
    removeClient,
  } = usePortfolio();

  const [allClients, setAllClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);

  useEffect(() => {
    fetchPortfolioItems(1, 100);
  }, []);

  useEffect(() => {
    const clients = [];
    portfolioItems.forEach(portfolio => {
      if (portfolio.clients) {
        portfolio.clients.forEach(client => {
          clients.push({
            ...client,
            portfolioId: portfolio._id,
            portfolioTitle: portfolio.title,
          });
        });
      }
    });
    setAllClients(clients);
  }, [portfolioItems]);

  useEffect(() => {
    const filtered = allClients.filter(client =>
      client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, allClients]);

  const handleDelete = async (portfolioId, clientId) => {
    if (confirm('Are you sure you want to remove this client?')) {
      await removeClient(portfolioId, clientId);
    }
  };

  const handleAddClient = (portfolioId) => {
    setSelectedPortfolioId(portfolioId);
    setShowAddForm(true);
    setEditingClientId(null);
  };

  const handleSuccess = () => {
    setShowAddForm(false);
    setEditingClientId(null);
    setSelectedPortfolioId(null);
  };

  return (
    <div className="space-y-6">
      {/* Add Form */}
      {showAddForm && selectedPortfolioId && (
        <ClientForm
          portfolioId={selectedPortfolioId}
          clientId={editingClientId}
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowAddForm(false);
            setEditingClientId(null);
          }}
        />
      )}

      {/* Search */}
      {!showAddForm && (
        <Card>
          <input
            type="text"
            placeholder="Search clients or projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
          />
        </Card>
      )}

      {/* Client Cards */}
      {!showAddForm && (
        <div className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {filteredClients.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-neutral-text">No clients found</p>
              {portfolioItems.length > 0 && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddClient(portfolioItems[0]._id)}
                  className="mt-4"
                >
                  Add First Client
                </Button>
              )}
            </Card>
          ) : (
            filteredClients.map(client => (
              <Card key={`${client.portfolioId}-${client._id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{client.clientName}</h3>
                    <p className="text-sm text-neutral-text mt-1">{client.projectTitle}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {client.servicesProvided?.map(service => (
                        <span key={service} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-neutral-text">Status</span>
                        <div className="font-semibold">{client.projectStatus}</div>
                      </div>
                      <div>
                        <span className="text-neutral-text">Budget</span>
                        <div className="font-semibold">${client.budget}</div>
                      </div>
                      <div>
                        <span className="text-neutral-text">Duration</span>
                        <div className="font-semibold">{client.projectDuration}</div>
                      </div>
                      <div>
                        <span className="text-neutral-text">Portfolio</span>
                        <div className="font-semibold text-xs">{client.portfolioTitle}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedPortfolioId(client.portfolioId);
                        setEditingClientId(client._id);
                        setShowAddForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="sm"
                      onClick={() => handleDelete(client.portfolioId, client._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ClientList;
