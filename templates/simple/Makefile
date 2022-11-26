.PHONY: nop
nop:

.PHONY: build
build:
	devcontainer --workspace-folder . build

.PHONY: up
up:
	devcontainer --workspace-folder . up

.PHONY: deploy
deploy: up
	devcontainer exec --workspace-folder . npx cdk deploy
