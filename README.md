
# E-Service Pro Portal

A comprehensive, multi-role e-service platform designed to connect users with skilled technicians seamlessly. This application serves as a fully-featured portal for requesting, managing, and fulfilling services.

## Description

E-Service Pro Portal is a modern web application built with React, TypeScript, and Tailwind CSS. It demonstrates a complete service lifecycle, from a user requesting a job to a technician completing it, followed by invoicing, payment, and a mutual rating system. The platform supports three distinct user roles, each with a tailored dashboard and capabilities.

## Key Features

- **Role-Based Access Control:** Separate, feature-rich interfaces for Users, Technicians, and Administrators.
- **Complete Service Lifecycle:**
    - Users can create, schedule, and track service requests.
    - Technicians can view job queues, accept, manage, and complete jobs.
    - Post-completion invoicing and a mock payment system.
- **Photo & Video Uploads:** Users can upload media when creating a request to provide technicians with visual context.
- **Real-Time Chat:** A direct messaging system for customers and technicians to communicate about active jobs.
- **Mutual Rating System:** After a job is paid for, both the customer and the technician can rate their experience.
- **Technician Management:** Users can find available technicians, and Admins can oversee all technicians on the platform.
- **Admin Analytics Dashboard:** Administrators have a high-level view of platform activity, including key metrics like revenue, user growth, and service request trends, visualized with charts.
- **Responsive & Modern UI:** A premium, clean, and intuitive user interface built with Tailwind CSS.

## Roles

1.  **User (Customer):**
    - Creates and manages service requests, with the ability to upload photos/videos.
    - Communicates with assigned technicians via chat.
    - Views service history.
    - Finds and views technician profiles.
    - Pays invoices for completed services.
    - Rates technicians after service completion.

2.  **Technician:**
    - Views a queue of available jobs.
    - Accepts and manages their assigned jobs (updates status from accepted to in-progress to completed).
    - Communicates with customers via chat.
    - Sends invoices to customers.
    - Views their job history and ratings.
    - Rates customers after payment.

3.  **Administrator:**
    - Accesses an analytics dashboard with key performance indicators (KPIs).
    - Views all service requests and technicians on the platform.
    - Oversees the entire operation.

## Tech Stack

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS
- **Charting:** Recharts
- **State Management:** React Context API (Authentication & Service Requests)
