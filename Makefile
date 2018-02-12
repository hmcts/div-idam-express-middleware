.PHONY: all install test clean

define compose
	echo "docker-compose$(1)"; \
	docker-compose$(1);
endef

install test test-nsp test-coverage:
	@$(call compose, run dev yarn $@)

clean:
	@$(call compose, run dev rm -rf node_modules)
	@$(call compose, run dev rm -rf coverage)
	@$(call compose, run dev rm -rf .sonar)
	@$(call compose, down)

bash:
	@$(call compose, run dev bash)
