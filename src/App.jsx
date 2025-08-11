/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import './App.scss';

import { useState } from 'react';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortConfig, setSortConfig] = useState('');

  const products = productsFromServer.map(product => {
    const category = categoriesFromServer.find(
      c => c.id === product.categoryId,
    );
    const user = usersFromServer.find(u => u.id === category.ownerId);
    const userClass = user.sex === 'male' ? 'has-text-link' : 'has-text-danger';

    return {
      id: product.id,
      name: product.name,
      categoryTitle: `${category.icon} - ${category.title}`,
      userName: user.name,
      userClass,
      userId: user.id,
      categoryId: product.categoryId,
    };
  });

  const filteredByUser = selectedUserId
    ? products.filter(p => p.userId === selectedUserId)
    : products;

  const filteredBySearch = searchQuery
    ? filteredByUser.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : filteredByUser;

  const visibleProducts = filteredBySearch;

  const toggleCategory = categoryId => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const clearCategories = () => setSelectedCategories([]);

  const resetFilter = () => {
    setSelectedUserId(null);
    setSearchQuery('');
    setSelectedCategories([]);
  };

  const filteredByCategories =
    selectedCategories.length > 0
      ? visibleProducts.filter(p => selectedCategories.includes(p.categoryId))
      : visibleProducts;

  const onSort = column => {
    setSortConfig(prev => (prev === column ? null : column));
  };

  const sortedProducts = sortConfig
    ? [...filteredByCategories].sort((a, b) => {
        const aVal = a[sortConfig];
        const bVal = b[sortConfig];

        if (typeof aVal === 'string') {
          return aVal.localeCompare(bVal);
        }
        return aVal - bVal;
      })
    : filteredByCategories;

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUserId === null ? 'is-active' : ''}
                onClick={() => setSelectedUserId(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  className={selectedUserId === user.id ? 'is-active' : ''}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={x => setSearchQuery(x.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {searchQuery && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button mr-6 ${selectedCategories.length === 0 ? 'is-success is-outlined' : ''}`}
                onClick={clearCategories}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${selectedCategories.includes(category.id) ? 'is-info' : ''}`}
                  href="#/"
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilter}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredByCategories.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th onClick={() => onSort('id')}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th onClick={() => onSort('name')}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th onClick={() => onSort('categoryTitle')}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th onClick={() => onSort('userName')}>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{product.categoryTitle}</td>
                    <td data-cy="ProductUser" className={product.userClass}>
                      {product.userName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
