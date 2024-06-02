import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "./style/destyle.css"

import { RouterProvider } from 'react-router-dom';
import route from './routes/route';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RecoilRoot } from 'recoil';

const query = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={query}>
    <RecoilRoot>
      <RouterProvider router={route} />
    </RecoilRoot>
  </QueryClientProvider>
);
