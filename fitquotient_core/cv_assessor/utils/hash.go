package utils

import "hash/fnv"

func StringToUint64(s string) uint64 {
	hash := fnv.New64a()
	hash.Write([]byte(s))
	return hash.Sum64()
}
