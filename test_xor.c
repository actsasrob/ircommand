#include <stdio.h>

#define BUF_SIZE 10

int main( int argc, char *argv[] )  {

   unsigned char txBuf[BUF_SIZE];
   unsigned char checksum = 0;

   //for (int i = 0; i < BUF_SIZE - 1; i++) {
   //   txBuf[i] = '_';
   //}
   txBuf[0] = 'E';
   txBuf[1] = 'e';
   txBuf[2] = 'c';
   txBuf[3] = 'h';
   txBuf[4] = 'o';
   txBuf[5] = 't';
   txBuf[6] = 'e';
   txBuf[7] = 's';
   txBuf[8] = 't';
   for (int i = 0; i < BUF_SIZE - 1; i++) {
      checksum = checksum ^ txBuf[i];
      printf("checksum = %i\n", checksum);
   }

   printf("Program name %s\n", argv[0]);
 
   if( argc == 2 ) {
      printf("The argument supplied is %s\n", argv[1]);
   }
   else if( argc > 2 ) {
      printf("Too many arguments supplied.\n");
   }
   else {
      printf("One argument expected.\n");
   }
}
