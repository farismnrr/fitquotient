# Multi-Architecture Build Quick Reference

## Quick Commands

### Setup (One-time)
```bash
make buildx-setup
```

### Build Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `make build-local TAG=latest` | Build for current platform only | Fast local testing |
| `make build-multi TAG=latest` | Build for AMD64 + ARM64 (no push) | Verify multi-arch build |
| `make push TAG=latest` | Build multi-arch + push to GHCR | Production deployment |

### Platform-Specific Pull

```bash
# Let Docker choose automatically (recommended)
docker pull ghcr.io/farismnrr/fitquotient:latest

# Force ARM64
docker pull --platform linux/arm64 ghcr.io/farismnrr/fitquotient:latest

# Force AMD64
docker pull --platform linux/amd64 ghcr.io/farismnrr/fitquotient:latest
```

## Supported Platforms

✅ **linux/amd64** - Intel/AMD 64-bit processors  
✅ **linux/arm64** - ARM 64-bit (Apple Silicon, AWS Graviton, etc.)

## Files Modified

- `Dockerfile` - Multi-arch Go cross-compilation
- `Makefile` - Buildx targets
- `.dockerignore` - Build optimization
- `.github/workflows/docker-build.yml` - CI/CD automation
- `README.md` - Documentation

## Verification

```bash
# Check buildx builder
docker buildx ls

# Inspect builder platforms
docker buildx inspect fitquotient-builder

# Check image manifest
docker buildx imagetools inspect ghcr.io/farismnrr/fitquotient:latest
```

## Troubleshooting

**Issue:** `buildx: command not found`  
**Solution:** Update Docker to latest version (20.10+)

**Issue:** Build fails on ARM64  
**Solution:** Ensure QEMU is installed: `docker run --rm --privileged multiarch/qemu-user-static --reset -p yes`

**Issue:** Slow build on non-native platform  
**Solution:** Use `make build-local` for faster single-platform builds

## GitHub Actions

Automatic builds trigger on:
- Push to `main` or `develop`
- New version tags (e.g., `v1.0.0`)
- Manual workflow dispatch

Check build status: https://github.com/farismnrr/fitquotient/actions
