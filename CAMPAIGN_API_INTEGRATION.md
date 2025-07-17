# Campaign API Integration

This document describes the integration of the campaign creation API into the AllCampaignsSection component.

## Overview

The campaign creation functionality has been integrated with the backend API at `http://localhost:4000/api/campaigns`. The integration includes:

1. **API Utility Functions** (`src/utils/api.js`)
2. **Form Data Transformation**
3. **Real-time Campaign Loading**
4. **Error Handling and Validation**

## API Endpoints Used

### Create Campaign
- **POST** `/api/campaigns`
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `application/json`

### Get Brand Campaigns
- **GET** `/api/campaigns/brand/my-campaigns`
- **Headers**: `Authorization: Bearer <token>`

## Form Data Structure

The form collects the following data and transforms it to match the API schema:

### Campaign Details
- `campaignName` (required)
- `campaignType` (required)
- `campaignBrief` (required)
- `deliverables` (required)
- `productImages` (array of URLs)

### Compensation
- `compensation.type` - "Monetary", "Barter/Gifting", or "Affiliate/Commission"
- `compensation.amount` - numeric value (for monetary)
- `compensation.currency` - "USD", "EUR", "GBP", "INR"
- `compensation.description` - additional details

### Timelines
- `timelines.applicationDeadline` - ISO date string
- `timelines.campaignStartDate` - ISO date string
- `timelines.campaignEndDate` - ISO date string

### Target Influencer
- `targetInfluencer.numberOfInfluencers` - number
- `targetInfluencer.targetNiche` - array of strings
- `targetInfluencer.followerCount.min` - number
- `targetInfluencer.followerCount.max` - number
- `targetInfluencer.countries` - array of strings
- `targetInfluencer.gender` - array of "Male", "Female", "Other"
- `targetInfluencer.ageRange.min` - number (13-100)
- `targetInfluencer.ageRange.max` - number (13-100)

## Features Implemented

### 1. Multi-step Form
- **Step 1**: Campaign Details (name, type, brief, deliverables, compensation, timelines)
- **Step 2**: Target Influencer (niche, follower count, demographics)
- **Step 3**: Preview and Launch

### 2. Form Validation
- Required field validation
- Date validation
- Numeric input validation
- User-friendly error messages

### 3. Real-time Data Loading
- Fetches campaigns on component mount
- Refreshes list after successful campaign creation
- Loading states and error handling
- Fallback to sample data if API fails

### 4. Enhanced UI Components
- Dropdown selections for niche and gender
- Conditional compensation amount/currency fields
- Range inputs for follower count and age
- Status-based campaign card styling

## Authentication

The API utility automatically handles authentication by:
1. Reading the auth token from localStorage or cookies
2. Adding the `Authorization: Bearer <token>` header to requests
3. Handling 401 responses by redirecting to login

## Error Handling

- Network errors are caught and displayed to users
- Form validation prevents invalid submissions
- API errors show descriptive messages
- Loading states prevent multiple submissions

## Usage

1. Navigate to the campaigns page
2. Click "Create New Campaign"
3. Fill out the multi-step form
4. Review the preview in step 3
5. Click "Launch Campaign" to submit

The campaign will be created with "Draft" status and can be managed from the campaigns list.

## Future Enhancements

- Image upload functionality for product images
- Campaign editing capabilities
- Campaign status management
- Advanced filtering and search
- Campaign analytics integration 