
# Testing Guide for Sentiment Analysis App

This document explains how to run the automated tests for the Sentiment Analysis application.

## Running Tests

Since we can't modify the package.json file directly in Lovable, we've created a script to run the tests:

```bash
# Make the test script executable (only needed once)
bash make_tests_executable.sh

# Run tests
./run-tests.sh

# Run tests in watch mode
./run-tests.sh watch

# Run tests with coverage
./run-tests.sh coverage
```

## Test Structure

The tests are organized in the following directories:

- `src/__tests__/components/` - Tests for React components
- `src/__tests__/services/` - Tests for services and API calls
- `src/__tests__/pages/` - Tests for pages

## Writing New Tests

When writing new tests:

1. Create test files with the `.test.tsx` or `.test.ts` extension
2. Place them in the appropriate directory under `src/__tests__/`
3. Use Jest and React Testing Library conventions

## Coverage Reports

When running tests with coverage, a report will be generated in the `coverage` directory.
