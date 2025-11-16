package utils

import (
	"fmt"
	"os"
	"runtime"
	"strings"
	"time"
)

type LogLevel int

const (
	DEBUG LogLevel = iota
	INFO
	WARN
	ERROR
)

var levelNames = map[LogLevel]string{
	DEBUG: "DEBUG",
	INFO:  "INFO",
	WARN:  "WARN",
	ERROR: "ERROR",
}

var levelColors = map[LogLevel]string{
	DEBUG: "\033[34m", // blue
	INFO:  "\033[0m",  // default
	WARN:  "\033[33m", // yellow
	ERROR: "\033[31m", // red
}

var currentLevel LogLevel

type Logger struct{}
type LoggerInterface interface {
	Debug(message string)
	Info(message string)
	Warn(message string)
	Error(message string)
	Fatal(message string)
}

var Log LoggerInterface = &Logger{}

func init() {
	levelStr := strings.ToUpper(os.Getenv("LOG_LEVEL"))
	switch levelStr {
	case "DEBUG":
		currentLevel = DEBUG
	case "INFO":
		currentLevel = INFO
	case "WARN":
		currentLevel = WARN
	case "ERROR":
		currentLevel = ERROR
	default:
		currentLevel = INFO
	}
}

func (l *Logger) log(level LogLevel, message string) {
	if level < currentLevel {
		return
	}

	_, file, line, ok := runtime.Caller(2)
	if !ok {
		file = "unknown"
		line = 0
	}

	// Extract file name
	fileName := file
	for i := len(file) - 1; i >= 0; i-- {
		if file[i] == '/' {
			fileName = file[i+1:]
			break
		}
	}

	color := levelColors[level]
	timestamp := time.Now().Format("2006-01-02 15:04:05")
	fmt.Printf("%s[%s] [%s] [%s:%d]: %s\033[0m\n", color, timestamp, levelNames[level], fileName, line, message)
}

func (l *Logger) Debug(message string) {
	l.log(DEBUG, message)
}

func (l *Logger) Info(message string) {
	l.log(INFO, message)
}

func (l *Logger) Warn(message string) {
	l.log(WARN, message)
}

func (l *Logger) Error(message string) {
	l.log(ERROR, message)
}

func (l *Logger) Fatal(message string) {
	l.log(ERROR, message)
	os.Exit(1)
}
