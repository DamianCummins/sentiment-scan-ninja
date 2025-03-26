
#!/bin/bash
# Test runner script for sentiment analysis app

echo "=== Running Jest Tests ==="

# Standard test
echo "Running standard tests..."
npx jest

# Watch mode (if requested)
if [ "$1" == "watch" ]; then
  echo "Running tests in watch mode..."
  npx jest --watch
fi

# Coverage (if requested)
if [ "$1" == "coverage" ]; then
  echo "Running tests with coverage..."
  npx jest --coverage
fi

echo "=== Test run completed ==="
