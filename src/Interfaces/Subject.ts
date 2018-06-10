interface Subject {
    registerObserver(o: Observer): void
    removeObserver(o: Observer): void
}