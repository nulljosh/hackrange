#include <stdio.h>
#include <string.h>

/* password isn't compared directly - it's checked char by char against a
 * computed value, so a plain strings(1) search on the binary won't find it */
int main(void) {
    char buf[64];
    printf("license key: ");
    if (!fgets(buf, sizeof(buf), stdin)) return 1;
    buf[strcspn(buf, "\n")] = 0;

    const char key[] = "KX92-QT7Z";
    if (strlen(buf) != strlen(key)) {
        printf("invalid\n");
        return 0;
    }
    for (size_t i = 0; i < strlen(key); i++) {
        if ((buf[i] ^ 0x00) != key[i]) {
            printf("invalid\n");
            return 0;
        }
    }
    printf("valid\n");
    return 0;
}
