#!/bin/bash

################################################################################
# FitQuotient Automated Deployment Script
#
# Purpose:
#   Automates the complete deployment process for FitQuotient application
#   including download, extraction, installation, configuration, and startup.
#
# Usage:
#   chmod +x install.sh
#   ./install.sh
#
# Requirements:
#   - Internet connection for downloading deployment package
#   - sudo privileges for system-level operations
#   - Docker and Docker Compose installed
#
# Author: FitQuotient Team
# Version: 1.0.0
################################################################################

set -e  # Exit immediately if any command fails
set -u  # Treat unset variables as errors

################################################################################
# Configuration Variables
################################################################################

DOWNLOAD_URL="https://github.com/farismnrr/fitquotient/raw/master/dist/fitquotient-deployment.zip"
DOWNLOAD_DIR="$HOME/Downloads"
ZIP_FILE="$DOWNLOAD_DIR/fitquotient-deployment.zip"
EXTRACT_DIR="$DOWNLOAD_DIR/fitquotient-deployment"
INSTALL_DIR="/opt/fitquotient"
LOG_FILE="/tmp/fitquotient-install-$(date +%Y%m%d-%H%M%S).log"

################################################################################
# Color Codes for Terminal Output
################################################################################

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'  # No Color

################################################################################
# Logging Functions
#
# These functions provide consistent, colored output and log all operations
# to a file for debugging purposes.
################################################################################

log_to_file() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

print_info() {
    local message="[INFO] $1"
    echo -e "${GREEN}${message}${NC}"
    log_to_file "$message"
}

print_error() {
    local message="[ERROR] $1"
    echo -e "${RED}${message}${NC}"
    log_to_file "$message"
}

print_warning() {
    local message="[WARNING] $1"
    echo -e "${YELLOW}${message}${NC}"
    log_to_file "$message"
}

print_step() {
    local message="[STEP] $1"
    echo -e "${CYAN}${message}${NC}"
    log_to_file "$message"
}

print_success() {
    local message="[SUCCESS] $1"
    echo -e "${BLUE}${message}${NC}"
    log_to_file "$message"
}

################################################################################
# Utility Functions
################################################################################

# Check if a command exists in the system PATH
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Get file size in human-readable format
get_file_size() {
    if [ -f "$1" ]; then
        du -h "$1" | cut -f1
    else
        echo "N/A"
    fi
}

################################################################################
# Main Installation Process
################################################################################

print_info "Starting FitQuotient deployment installation..."
print_info "Log file: $LOG_FILE"
echo ""

################################################################################
# Step 1: Download Deployment Package
#
# Downloads the FitQuotient deployment zip file from GitHub repository.
# Supports both wget and curl for maximum compatibility.
################################################################################

print_step "Step 1/6: Downloading deployment package from GitHub"
print_info "Download URL: $DOWNLOAD_URL"
print_info "Target directory: $DOWNLOAD_DIR"

# Ensure Downloads directory exists
if [ ! -d "$DOWNLOAD_DIR" ]; then
    print_info "Creating Downloads directory: $DOWNLOAD_DIR"
    mkdir -p "$DOWNLOAD_DIR"
    log_to_file "Created directory: $DOWNLOAD_DIR"
fi

# Remove existing zip file if present
if [ -f "$ZIP_FILE" ]; then
    print_warning "Existing zip file found, removing: $ZIP_FILE"
    rm -f "$ZIP_FILE"
    log_to_file "Removed existing file: $ZIP_FILE"
fi

# Download using available tool (wget or curl)
print_info "Initiating download..."
if command_exists wget; then
    print_info "Using wget for download"
    wget -O "$ZIP_FILE" "$DOWNLOAD_URL" 2>&1 | tee -a "$LOG_FILE"
    log_to_file "Download completed using wget"
elif command_exists curl; then
    print_info "Using curl for download"
    curl -L -o "$ZIP_FILE" "$DOWNLOAD_URL" 2>&1 | tee -a "$LOG_FILE"
    log_to_file "Download completed using curl"
else
    print_error "Neither wget nor curl is installed"
    print_error "Please install wget or curl and try again"
    exit 1
fi

# Verify download success
if [ ! -f "$ZIP_FILE" ]; then
    print_error "Download failed - file not found: $ZIP_FILE"
    exit 1
fi

FILE_SIZE=$(get_file_size "$ZIP_FILE")
print_success "Download completed successfully"
print_info "Downloaded file: $ZIP_FILE"
print_info "File size: $FILE_SIZE"
echo ""

################################################################################
# Step 2: Install Make Utility
#
# Ensures the 'make' build tool is installed on the system.
# Automatically detects the package manager and installs if needed.
################################################################################

print_step "Step 2/6: Verifying make installation"

if command_exists make; then
    MAKE_VERSION=$(make --version | head -n 1)
    print_success "make is already installed: $MAKE_VERSION"
    log_to_file "make found: $MAKE_VERSION"
else
    print_warning "make is not installed, attempting installation..."
    
    # Detect package manager and install
    if command_exists apt-get; then
        print_info "Detected package manager: apt-get (Debian/Ubuntu)"
        print_info "Updating package lists..."
        sudo apt-get update 2>&1 | tee -a "$LOG_FILE"
        print_info "Installing make..."
        sudo apt-get install -y make 2>&1 | tee -a "$LOG_FILE"
        log_to_file "Installed make using apt-get"
    elif command_exists yum; then
        print_info "Detected package manager: yum (RHEL/CentOS)"
        print_info "Installing make..."
        sudo yum install -y make 2>&1 | tee -a "$LOG_FILE"
        log_to_file "Installed make using yum"
    elif command_exists dnf; then
        print_info "Detected package manager: dnf (Fedora)"
        print_info "Installing make..."
        sudo dnf install -y make 2>&1 | tee -a "$LOG_FILE"
        log_to_file "Installed make using dnf"
    elif command_exists pacman; then
        print_info "Detected package manager: pacman (Arch Linux)"
        print_info "Installing make..."
        sudo pacman -S --noconfirm make 2>&1 | tee -a "$LOG_FILE"
        log_to_file "Installed make using pacman"
    else
        print_error "Could not detect package manager"
        print_error "Please install 'make' manually and run this script again"
        exit 1
    fi
    
    print_success "make has been installed successfully"
fi
echo ""

################################################################################
# Step 3: Extract Deployment Package
#
# Extracts the downloaded zip file to the Downloads directory.
# Handles existing directories and ensures unzip utility is available.
################################################################################

print_step "Step 3/6: Extracting deployment package"
print_info "Extraction target: $EXTRACT_DIR"

# Ensure unzip utility is installed
if ! command_exists unzip; then
    print_warning "unzip is not installed, attempting installation..."
    
    if command_exists apt-get; then
        print_info "Installing unzip using apt-get..."
        sudo apt-get install -y unzip 2>&1 | tee -a "$LOG_FILE"
    elif command_exists yum; then
        print_info "Installing unzip using yum..."
        sudo yum install -y unzip 2>&1 | tee -a "$LOG_FILE"
    elif command_exists dnf; then
        print_info "Installing unzip using dnf..."
        sudo dnf install -y unzip 2>&1 | tee -a "$LOG_FILE"
    elif command_exists pacman; then
        print_info "Installing unzip using pacman..."
        sudo pacman -S --noconfirm unzip 2>&1 | tee -a "$LOG_FILE"
    else
        print_error "Could not install unzip automatically"
        print_error "Please install 'unzip' manually and run this script again"
        exit 1
    fi
    
    print_success "unzip has been installed successfully"
    log_to_file "Installed unzip utility"
fi

# Clean up existing extraction directory
if [ -d "$EXTRACT_DIR" ]; then
    print_warning "Existing extraction directory found, removing..."
    rm -rf "$EXTRACT_DIR"
    log_to_file "Removed existing directory: $EXTRACT_DIR"
fi

# Extract the zip file
print_info "Extracting zip file..."
unzip -q "$ZIP_FILE" -d "$DOWNLOAD_DIR" 2>&1 | tee -a "$LOG_FILE"
log_to_file "Extraction completed"

# The zip file now contains a 'fitquotient' folder by default
EXTRACTED_FOLDER="$DOWNLOAD_DIR/fitquotient"

# Verify extraction
if [ ! -d "$EXTRACTED_FOLDER" ]; then
    print_error "Could not find extracted fitquotient folder: $EXTRACTED_FOLDER"
    print_error "Please check the zip file contents and try again"
    exit 1
fi

log_to_file "Found extracted folder: $EXTRACTED_FOLDER"

# Rename to standard extraction directory name
if [ "$EXTRACTED_FOLDER" != "$EXTRACT_DIR" ]; then
    print_info "Renaming extracted folder to standard name..."
    # Remove existing extract dir if present
    if [ -d "$EXTRACT_DIR" ]; then
        rm -rf "$EXTRACT_DIR"
    fi
    mv "$EXTRACTED_FOLDER" "$EXTRACT_DIR"
    log_to_file "Renamed $EXTRACTED_FOLDER to $EXTRACT_DIR"
fi

# Count extracted files
FILE_COUNT=$(find "$EXTRACT_DIR" -type f | wc -l)
print_success "Extraction completed successfully"
print_info "Extracted location: $EXTRACT_DIR"
print_info "Total files extracted: $FILE_COUNT"
echo ""

################################################################################
# Step 4: Move to Installation Directory
#
# Moves the extracted files to /opt/fitquotient for system-wide installation.
# Handles existing installations and sets proper permissions.
################################################################################

print_step "Step 4/6: Moving application to installation directory"
print_info "Installation directory: $INSTALL_DIR"

# Remove existing installation
if [ -d "$INSTALL_DIR" ]; then
    print_warning "Existing installation found at $INSTALL_DIR"
    print_info "Backing up and removing existing installation..."
    BACKUP_DIR="/tmp/fitquotient-backup-$(date +%Y%m%d-%H%M%S)"
    sudo mv "$INSTALL_DIR" "$BACKUP_DIR"
    log_to_file "Backed up existing installation to: $BACKUP_DIR"
    print_info "Backup created at: $BACKUP_DIR"
fi

# Move to installation directory
print_info "Moving files to $INSTALL_DIR..."
sudo mv "$EXTRACT_DIR" "$INSTALL_DIR"
log_to_file "Moved application to: $INSTALL_DIR"

# Set proper ownership
print_info "Setting file permissions..."
print_info "Owner: $USER:$USER"
sudo chown -R $USER:$USER "$INSTALL_DIR"
log_to_file "Set ownership to $USER:$USER"

# Verify installation
if [ ! -d "$INSTALL_DIR" ]; then
    print_error "Installation directory not found after move operation"
    exit 1
fi

INSTALL_SIZE=$(du -sh "$INSTALL_DIR" | cut -f1)
print_success "Application moved successfully"
print_info "Installation path: $INSTALL_DIR"
print_info "Installation size: $INSTALL_SIZE"
echo ""

################################################################################
# Step 5: Configure Environment
#
# Executes the env-config.sh script to generate .env file with all
# required environment variables for the application.
################################################################################

print_step "Step 5/6: Configuring environment variables"

# Change to installation directory
print_info "Changing to installation directory..."
cd "$INSTALL_DIR"
log_to_file "Changed directory to: $INSTALL_DIR"

# Verify env-config.sh exists
ENV_CONFIG_SCRIPT="./env-config.sh"
if [ ! -f "$ENV_CONFIG_SCRIPT" ]; then
    print_error "Environment configuration script not found: $ENV_CONFIG_SCRIPT"
    print_error "Please ensure the deployment package contains env-config.sh"
    exit 1
fi

print_info "Found environment configuration script: $ENV_CONFIG_SCRIPT"

# Make script executable
print_info "Setting executable permissions on env-config.sh..."
chmod +x "$ENV_CONFIG_SCRIPT"
log_to_file "Set executable permission on $ENV_CONFIG_SCRIPT"

# Execute configuration script
print_info "Executing environment configuration script..."
bash "$ENV_CONFIG_SCRIPT" 2>&1 | tee -a "$LOG_FILE"
log_to_file "Environment configuration script executed"

# Verify .env file was created
if [ -f ".env" ]; then
    ENV_LINES=$(wc -l < .env)
    print_success "Environment configuration completed"
    print_info "Generated .env file with $ENV_LINES configuration lines"
    log_to_file "Created .env file with $ENV_LINES lines"
else
    print_warning ".env file not found after running env-config.sh"
    print_warning "Application may not start correctly"
fi
echo ""

################################################################################
# Step 6: Start Docker Containers
#
# Executes 'make docker-up' to build and start all Docker containers
# required for the FitQuotient application.
################################################################################

print_step "Step 6/6: Starting Docker containers"

# Verify Makefile exists
if [ ! -f "Makefile" ]; then
    print_error "Makefile not found in $INSTALL_DIR"
    print_error "Cannot start Docker containers without Makefile"
    exit 1
fi

print_info "Found Makefile"
log_to_file "Makefile verified"

# Verify Docker is installed
print_info "Checking Docker installation..."
if ! command_exists docker; then
    print_error "Docker is not installed on this system"
    print_error "Please install Docker and try again"
    print_error "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

DOCKER_VERSION=$(docker --version)
print_success "Docker is installed: $DOCKER_VERSION"
log_to_file "Docker version: $DOCKER_VERSION"

# Verify Docker Compose is installed
print_info "Checking Docker Compose installation..."
if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
    print_error "Docker Compose is not installed on this system"
    print_error "Please install Docker Compose and try again"
    print_error "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

if command_exists docker-compose; then
    COMPOSE_VERSION=$(docker-compose --version)
else
    COMPOSE_VERSION=$(docker compose version)
fi
print_success "Docker Compose is installed: $COMPOSE_VERSION"
log_to_file "Docker Compose version: $COMPOSE_VERSION"

# Check Docker daemon status
print_info "Verifying Docker daemon is running..."
if ! docker info >/dev/null 2>&1; then
    print_error "Docker daemon is not running"
    print_error "Please start Docker and try again"
    exit 1
fi

print_success "Docker daemon is running"
log_to_file "Docker daemon verified"

# Execute make docker-up
print_info "Executing: make docker-up"
print_info "This may take several minutes on first run..."
log_to_file "Starting Docker containers with make docker-up"

make docker-up 2>&1 | tee -a "$LOG_FILE"

log_to_file "Docker containers started"
print_success "Docker containers started successfully"
echo ""

################################################################################
# Installation Complete
################################################################################

print_success "========================================="
print_success "  FitQuotient Deployment Completed!     "
print_success "========================================="
echo ""
print_info "Installation Summary:"
print_info "  • Installation directory: $INSTALL_DIR"
print_info "  • Log file: $LOG_FILE"
print_info "  • Configuration file: $INSTALL_DIR/.env"
echo ""
print_info "Useful Commands:"
print_info "  • Check container status:  docker ps"
print_info "  • View logs:              docker-compose logs -f"
print_info "  • Stop containers:        make docker-down"
print_info "  • Restart containers:     make docker-restart"
echo ""
print_success "Your FitQuotient application is now running!"
log_to_file "Installation completed successfully"
