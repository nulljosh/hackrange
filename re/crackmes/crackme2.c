#include <stdio.h>
#include <string.h>

/* The key never sits in the binary as plain text: each byte is stored XORed,
 * so strings(1) finds nothing and you have to read the loop to get it. */
int main(void) {
    char buf[64];
    printf("license key: ");
    if (!fgets(buf, sizeof(buf), stdin)) return 1;
    buf[strcspn(buf, "\n")] = 0;

    static const unsigned char key[] = {0x11, 0x02, 0x63, 0x68, 0x77, 0x0b, 0x0e, 0x6d, 0x00};
    if (strlen(buf) != sizeof(key)) {
        printf("invalid\n");
        return 0;
    }
    for (size_t i = 0; i < sizeof(key); i++) {
        if ((buf[i] ^ 0x5A) != key[i]) {
            printf("invalid\n");
            return 0;
        }
    }
    printf("valid\n");
    return 0;
}
