#!/bin/bash

# Carolina Mobile Tire - Docker Deployment Script
# Production deployment with intelligent port selection and management features

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_NAME="carolina-tire-website"
IMAGE_NAME="carolina-tire-production"
DEFAULT_PORT=7100
NGINX_CONFIG_FILE="nginx.conf"
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Function to print colored output
print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if port is available
is_port_available() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1
    else
        return 0
    fi
}

# Function to find next available port
find_next_available_port() {
    local start_port=$1
    local port=$start_port
    
    while ! is_port_available $port; do
        port=$((port + 1))
    done
    
    echo $port
}

# Function to check Docker installation
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_color "$RED" "Error: Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_color "$RED" "Error: Docker daemon is not running. Please start Docker."
        exit 1
    fi
}

# Function to check Docker Compose installation
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        if docker compose version &> /dev/null; then
            DOCKER_COMPOSE_CMD="docker compose"
        else
            print_color "$RED" "Error: Docker Compose is not installed."
            exit 1
        fi
    else
        DOCKER_COMPOSE_CMD="docker-compose"
    fi
}

# Function to build Docker image
build_image() {
    print_color "$BLUE" "\n📦 Building Docker image..."
    docker build -t $IMAGE_NAME . || {
        print_color "$RED" "Failed to build Docker image"
        exit 1
    }
    print_color "$GREEN" "✅ Docker image built successfully"
}

# Function to deploy container
deploy_container() {
    local port=$1
    local container_name=$2
    
    print_color "$BLUE" "\n🚀 Deploying container..."
    
    # Stop and remove existing container if it exists
    if docker ps -a | grep -q $container_name; then
        print_color "$YELLOW" "Stopping existing container..."
        docker stop $container_name >/dev/null 2>&1 || true
        docker rm $container_name >/dev/null 2>&1 || true
    fi
    
    # Update docker-compose.yml with selected port
    if [ -f "$DOCKER_COMPOSE_FILE" ]; then
        # Create a temporary docker-compose file with the selected port
        sed "s/7100:7100/$port:7100/g" $DOCKER_COMPOSE_FILE > docker-compose.temp.yml
        
        # Deploy using docker-compose
        $DOCKER_COMPOSE_CMD -f docker-compose.temp.yml up -d
        
        # Clean up temp file
        rm docker-compose.temp.yml
    else
        # Fallback to docker run if docker-compose.yml doesn't exist
        docker run -d \
            --name $container_name \
            -p $port:7100 \
            --restart unless-stopped \
            -v $(pwd)/src:/usr/share/nginx/html:ro \
            $IMAGE_NAME
    fi
    
    print_color "$GREEN" "✅ Container deployed successfully"
}

# Function to check container status
check_status() {
    local container_name=$1
    if docker ps | grep -q $container_name; then
        print_color "$GREEN" "✅ Container '$container_name' is running"
        docker ps --filter "name=$container_name" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        print_color "$YELLOW" "⚠️  Container '$container_name' is not running"
    fi
}

# Function to show container logs
show_logs() {
    local container_name=$1
    print_color "$BLUE" "\n📋 Showing last 50 lines of logs..."
    docker logs --tail 50 -f $container_name
}

# Function to stop container
stop_container() {
    local container_name=$1
    print_color "$YELLOW" "\n🛑 Stopping container..."
    docker stop $container_name
    print_color "$GREEN" "✅ Container stopped"
}

# Function to restart container
restart_container() {
    local container_name=$1
    print_color "$YELLOW" "\n🔄 Restarting container..."
    docker restart $container_name
    print_color "$GREEN" "✅ Container restarted"
}

# Function to backup website files
backup_website() {
    local backup_dir="backups"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="${backup_dir}/carolina-tire-backup-${timestamp}.tar.gz"
    
    mkdir -p $backup_dir
    print_color "$BLUE" "\n💾 Creating backup..."
    tar -czf $backup_file src/ screenshots/ *.html *.css *.js *.md 2>/dev/null || true
    print_color "$GREEN" "✅ Backup created: $backup_file"
}

# Function to update from git
update_from_git() {
    print_color "$BLUE" "\n🔄 Updating from GitHub..."
    git pull origin main || {
        print_color "$RED" "Failed to update from Git. Please check your connection."
        return 1
    }
    print_color "$GREEN" "✅ Updated from GitHub"
    
    # Rebuild and redeploy
    build_image
    restart_container $CONTAINER_NAME
}

# Main menu
show_menu() {
    echo
    print_color "$BLUE" "================================"
    print_color "$BLUE" " Carolina Tire Docker Manager"
    print_color "$BLUE" "================================"
    echo
    echo "1) Deploy new container"
    echo "2) Check container status"
    echo "3) View logs"
    echo "4) Stop container"
    echo "5) Restart container"
    echo "6) Rebuild and deploy"
    echo "7) Backup website"
    echo "8) Update from GitHub"
    echo "9) Remove container and images"
    echo "0) Exit"
    echo
}

# Main script
main() {
    clear
    print_color "$BLUE" "======================================"
    print_color "$BLUE" " Carolina Mobile Tire - Docker Deploy"
    print_color "$BLUE" "======================================"
    
    # Check prerequisites
    check_docker
    check_docker_compose
    
    # Interactive menu
    while true; do
        show_menu
        read -p "Select an option: " choice
        
        case $choice in
            1)
                # Deploy new container
                print_color "$BLUE" "\n🚀 Starting deployment process..."
                
                # Port selection
                print_color "$YELLOW" "\n📍 Port Configuration"
                print_color "$NC" "Default application port: $DEFAULT_PORT"
                
                # Check if default port is available
                if is_port_available $DEFAULT_PORT; then
                    print_color "$GREEN" "✅ Default port $DEFAULT_PORT is available"
                    suggested_port=$DEFAULT_PORT
                else
                    print_color "$YELLOW" "⚠️  Default port $DEFAULT_PORT is in use"
                    suggested_port=$(find_next_available_port $DEFAULT_PORT)
                    print_color "$GREEN" "✅ Next available port: $suggested_port"
                fi
                
                # Ask user for port
                echo
                read -p "Enter port to use [$suggested_port]: " user_port
                selected_port=${user_port:-$suggested_port}
                
                # Validate port
                if ! [[ "$selected_port" =~ ^[0-9]+$ ]] || [ "$selected_port" -lt 1 ] || [ "$selected_port" -gt 65535 ]; then
                    print_color "$RED" "Invalid port number. Using suggested port: $suggested_port"
                    selected_port=$suggested_port
                fi
                
                if ! is_port_available $selected_port; then
                    print_color "$RED" "Port $selected_port is already in use!"
                    continue
                fi
                
                # Container name
                read -p "Enter container name [$CONTAINER_NAME]: " user_container_name
                selected_container_name=${user_container_name:-$CONTAINER_NAME}
                
                # Build and deploy
                build_image
                deploy_container $selected_port $selected_container_name
                
                # Show access information
                print_color "$GREEN" "\n✅ Deployment Complete!"
                print_color "$BLUE" "================================"
                print_color "$NC" "🌐 Website is now accessible at:"
                print_color "$GREEN" "   http://localhost:$selected_port"
                print_color "$GREEN" "   http://0.0.0.0:$selected_port"
                
                # Get local IP
                local_ip=$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}' 2>/dev/null || echo "your-server-ip")
                if [ ! -z "$local_ip" ] && [ "$local_ip" != "your-server-ip" ]; then
                    print_color "$GREEN" "   http://$local_ip:$selected_port"
                fi
                
                print_color "$BLUE" "================================"
                print_color "$NC" "📦 Container: $selected_container_name"
                print_color "$NC" "🔧 Management: Run './deploy.sh' again"
                ;;
            
            2)
                check_status $CONTAINER_NAME
                ;;
            
            3)
                show_logs $CONTAINER_NAME
                ;;
            
            4)
                stop_container $CONTAINER_NAME
                ;;
            
            5)
                restart_container $CONTAINER_NAME
                ;;
            
            6)
                build_image
                restart_container $CONTAINER_NAME
                print_color "$GREEN" "✅ Container rebuilt and redeployed"
                ;;
            
            7)
                backup_website
                ;;
            
            8)
                update_from_git
                ;;
            
            9)
                print_color "$YELLOW" "\n⚠️  Warning: This will remove the container and images"
                read -p "Are you sure? (y/N): " confirm
                if [[ $confirm == [yY] ]]; then
                    docker stop $CONTAINER_NAME 2>/dev/null || true
                    docker rm $CONTAINER_NAME 2>/dev/null || true
                    docker rmi $IMAGE_NAME 2>/dev/null || true
                    print_color "$GREEN" "✅ Container and images removed"
                fi
                ;;
            
            0)
                print_color "$GREEN" "Goodbye! 👋"
                exit 0
                ;;
            
            *)
                print_color "$RED" "Invalid option. Please try again."
                ;;
        esac
        
        echo
        read -p "Press Enter to continue..."
    done
}

# Quick deploy option (non-interactive)
if [ "$1" == "--quick" ] || [ "$1" == "-q" ]; then
    check_docker
    check_docker_compose
    
    # Find available port
    if is_port_available $DEFAULT_PORT; then
        port=$DEFAULT_PORT
    else
        port=$(find_next_available_port $DEFAULT_PORT)
    fi
    
    print_color "$BLUE" "Quick deploy on port $port..."
    build_image
    deploy_container $port $CONTAINER_NAME
    
    print_color "$GREEN" "\n✅ Quick deployment complete!"
    print_color "$NC" "🌐 Access at: http://localhost:$port"
    exit 0
fi

# Help option
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    print_color "$BLUE" "Carolina Mobile Tire - Docker Deployment Script"
    echo
    echo "Usage: ./deploy.sh [OPTIONS]"
    echo
    echo "Options:"
    echo "  -q, --quick    Quick deploy with auto-detected port"
    echo "  -h, --help     Show this help message"
    echo
    echo "Without options, runs in interactive mode with full menu."
    exit 0
fi

# Run main function
main