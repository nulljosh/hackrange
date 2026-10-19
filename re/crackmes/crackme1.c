#include <stdio.h>
#include <string.h>

int main(void) {
    char buf[64];
    printf("password: ");
    if (!fgets(buf, sizeof(buf), stdin)) return 1;
    buf[strcspn(buf, "\n")] = 0;
    if (strcmp(buf, "hunter2") == 0) {
        printf("correct\n");
    } else {
        printf("nope\n");
    }
    return 0;
}
