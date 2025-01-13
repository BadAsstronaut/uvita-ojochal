.PHONY: build
build: node_install
	@npx @11ty/eleventy --input=src --output=dist

.PHONY: run
run: node_install
	@npx @11ty/eleventy --input=src --serve

.PHONY: node_install
node_install: formula := node
node_install: brew_formula_install

.PHONY: brew_formula_install
brew_formula_install:
	@echo "> Checking if $(formula) is installed"
	@if ! command -v "$(formula)" &> /dev/null; then \
		echo ">> $(formula) not found; installing..."; \
		brew install "$(formula)"; \
	else \
		echo ">> $(formula) installed"; \
	fi

## How do you not have homebrew installed!?
.PHONY: install_homebrew
install_homebrew:
	@echo "Checking if Homebrew is installed..."
	@if ! command -v brew &> /dev/null; then \
		echo ">> Homebrew not found, installing..."; \
		/bin/bash -c "$$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; \
		echo "PATH=/opt/homebrew/bin:$$PATH" >> ~/.zshrc; \
	else \
		echo ">> Homebrew is already installed"; \
	fi
