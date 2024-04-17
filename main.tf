terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  cloud {
    organization = "liza-organization"

    workspaces {
      name = "mzuiit-lab2"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "eu-north-1"
}

resource "aws_security_group" "liza-lab2-sg" {
  name = "liza-lab2-sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

    tags = {
        name = "Security group"
        project = "MZUIIT"
        owner = "Liza Dolhova"
    }
}

resource "aws_key_pair" "lab2-key" {
    key_name = "lab2-key"
    public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDsP3PvBa+arzKY16QBQs7o0F20JQXAgqYPm5ERxz4L9yLiEL9DgtbhrVhcDgkWQNFomlGeFOt3cXTQq28toL/HO59bRbU+s77GuSa0q6PeNGySddXogfYX9xi4hU07jMSKOvkaFYZUlOYjZ6EO+XCr/BkEc7Q5pzu96MyTDbbKEnxlaUFCTgqP+8a+ldfBpSD8j1O95cVrBDgOfniJCEYywee9DTdCjPPO+E/IBNY55+ADCHKPdOA2Pr0IwHw7yE97AKmFDgYG0I7enQuMhrk2DJLvP8UO1UGDANWVgzXYkKLB/5JvyoC+xn1LSlDoJcNzYkyYpJt6mAldAFjF8m+H"

    tags = {
        name = "Lab 2 keypair"
        project = "MZUIIT"
        owner = "Liza Dolhova"
    }
}

resource "aws_instance" "lab2-server" {
  ami             = "ami-011e54f70c1c91e17"
  instance_type   = "t3.micro"
  key_name        = aws_key_pair.lab2-key.key_name
  security_groups = [aws_security_group.liza-lab2-sg.name]
  user_data       = file("terraform.sh")

  tags = {
        name = "Lab 2 instance"
        project = "MZUIIT"
        owner = "Liza Dolhova"
    }
}
