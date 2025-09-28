'use client';
import React, { useState, useEffect } from 'react';
import styles from './IslandTemplates.module.css';
import SearchControls from './components/IslandTemplates/SearchControls';
import Pagination from './components/Pagination';
import SidebarNavigation from './components/SidebarNavigation';
import IslandTemplateTable from './components/IslandTemplates/IslandTemplateTable';
import AddModal from './components/IslandTemplates/AddModal';
import { IslandTemplate } from './IslandTemplateData';
// import {islandTemplateRecords} from './IslandTemplateData';
import { getAllIslandTemplates } from '@/services/admin.srv';
import { deleteIslandTemplate } from '@/services/admin.srv';
import { toast } from 'react-toastify';

const IslandTemplateList: React.FC = () => {
  // State for filters, search, and sort
  const [filteredTemplates, setFilteredTemplates] = useState<IslandTemplate[]>([]);
  const [templates, setTemplates] = useState<IslandTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Latest');

  // Current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 15;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIslandTemplates = async () => {
      try {
        setLoading(true);
        const response = await getAllIslandTemplates();
        console.log('response', response);

        // Ensure we have the expected data structure with required fields
        if (response) {
          setTemplates(response);
        } else {
          console.error('Invalid users data received:', response);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIslandTemplates();
  }, []);

  // Apply filters, search, and sort when dependencies change
  useEffect(() => {
    let result = [...templates];

    // Apply search
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((template) => template.name.toLowerCase().includes(searchLower));
    }

    // Apply sort
    switch (sortOption) {
      case 'Name: A to Z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Name: Z to A':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Oldest':
        result.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        break;
      default: // Latest
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
    }

    setFilteredTemplates(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, sortOption, templates]);

  // Get current page templates
  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = filteredTemplates.slice(indexOfFirstTemplate, indexOfLastTemplate);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handler functions
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  // Handle template deletion
  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteIslandTemplate(templateId, 'Deleted by Admin');
      setTemplates(templates.filter((template) => template.id !== templateId));
      setFilteredTemplates(filteredTemplates.filter((template) => template.id !== templateId));

      const actionText = 'deleted';
      toast.success(`Island template has been ${actionText} successfully`);
    } catch (error) {
      let errorMessage = 'An error occurred while deleting island template';

      // Check for axios error response format
      if (error.response && error.response.data && error.response.data.errors) {
        // Extract first error message from the errors array
        const firstError = error.response.data.errors[0];
        errorMessage = firstError.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(`Failed to delete island template: ${errorMessage}`);
      console.error('Error deleting island template:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Function to handle adding a new template
  const handleAddTemplate = (data: { name: string; image: File | null }) => {
    //Integrate here
    console.log(data);

    // Close the modal
    setIsModalOpen(false);
  };

  return (
    <div className="app-container">
      <div className={styles.pageLayout}>
        <SidebarNavigation activeItem="island-templates" />
        <main className={styles.container}>
          <section className={styles.wrapper}>
            <div className={styles.contentLayout}>
              <div className={styles.mainContent}>
                <SearchControls
                  onSearchChange={handleSearchChange}
                  onSortChange={handleSortChange}
                  searchTerm={searchTerm}
                  sortOption={sortOption}
                  totalTemplates={filteredTemplates.length}
                  onOpenModal={handleOpenModal}
                />

                {loading ? (
                  <div className={styles.loadingContainer}>
                    <p>Loading courses...</p>
                  </div>
                ) : (
                  <>
                    <section className={styles.card}>
                      <IslandTemplateTable
                        templates={currentTemplates}
                        onDeleteTemplate={handleDeleteTemplate}
                      />

                      {filteredTemplates.length > templatesPerPage && (
                        <div className="pagination-container">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(filteredTemplates.length / templatesPerPage)}
                            onPageChange={paginate}
                          />
                        </div>
                      )}
                    </section>
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      <AddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTemplate}
      />
    </div>
  );
};

export default IslandTemplateList;
