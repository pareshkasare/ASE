package com.example.ved.lab5;

import android.Manifest;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Locale;

import static android.R.attr.bitmap;
import static com.example.ved.lab5.R.id.activity_sign_up;
import static com.example.ved.lab5.R.id.addline1;
import static com.example.ved.lab5.R.id.addline2;

public class SignUp extends AppCompatActivity {

    private static final int MY_PERMISSIONS_REQUEST_GET_LOCATION = 705;
    int TAKE_PHOTO_CODE = 0, UPLOAD_CODE = 1;
    ImageView userImage ;
    LocationManager userCurrentLocation;
    LocationListener userCurrentLocationListener;
    Geocoder geocoder;
    Location location;
    StringBuilder userAddress;
    final Context context = this;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);

        userCurrentLocation = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        userCurrentLocationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {

            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {

            }

            @Override
            public void onProviderEnabled(String provider) {
            System.out.println("provider enabled");
                getAddress();
            }

            @Override
            public void onProviderDisabled(String provider) {

            }
        };
/*
        if (ContextCompat.checkSelfPermission(SignUp.this,
                Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {

            // Should we show an explanation?
            if (ActivityCompat.shouldShowRequestPermissionRationale(SignUp.this,
                    Manifest.permission.ACCESS_FINE_LOCATION)) {

                // Show an explanation to the user *asynchronously* -- don't block
                // this thread waiting for the user's response! After the user
                // sees the explanation, try again to request the permission.

            } else {

                // No explanation needed, we can request the permission.

                ActivityCompat.requestPermissions(SignUp.this,
                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                        MY_PERMISSIONS_REQUEST_GET_LOCATION);

                // MY_PERMISSIONS_REQUEST_READ_CONTACTS is an
                // app-defined int constant. The callback method gets the
                // result of the request.
            }
        }
        */
        if (ContextCompat.checkSelfPermission(SignUp.this,
                Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED || !userCurrentLocation.isProviderEnabled(userCurrentLocation.GPS_PROVIDER)) {

            AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(context);
            alertDialogBuilder.setTitle("Location Access");
            alertDialogBuilder
                    .setMessage("Enabling location service would AutoFill address for you!!!")
                    .setCancelable(false)
                    .setNegativeButton("OK",new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog,int id) {
                            // if this button is clicked, just close
                            // the dialog box and do nothing
                            dialog.cancel();
                        }
                    });

            AlertDialog alertDialog = alertDialogBuilder.create();

            alertDialog.show();

        }
        if(userCurrentLocation.isProviderEnabled(userCurrentLocation.GPS_PROVIDER)) {
            getAddress();
        }
        ImageButton capture = (ImageButton) findViewById(R.id.camera);
        ImageButton upload = (ImageButton)findViewById(R.id.upload);
        userImage = (ImageView) findViewById(R.id.imageView);

        capture.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {

                if (ContextCompat.checkSelfPermission(SignUp.this,
                        Manifest.permission.CAMERA)
                        != PackageManager.PERMISSION_GRANTED) {

                    AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(context);
                    alertDialogBuilder.setTitle("Camera");
                    alertDialogBuilder
                            .setMessage("Camera permission needed! Please update app settings")
                            .setCancelable(false)
                            .setNegativeButton("OK",new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog,int id) {
                                    // if this button is clicked, just close
                                    // the dialog box and do nothing
                                    dialog.cancel();
                                }
                            });

                    AlertDialog alertDialog = alertDialogBuilder.create();

                    alertDialog.show();

                }
                else {
                    Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                    startActivityForResult(cameraIntent, TAKE_PHOTO_CODE);
                }
            }
        });
        upload.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {

                if (ContextCompat.checkSelfPermission(SignUp.this,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE)
                        != PackageManager.PERMISSION_GRANTED) {
                    AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(context);
                    alertDialogBuilder.setTitle("Storage");
                    alertDialogBuilder
                            .setMessage("Storage permission needed! Please update app settings")
                            .setCancelable(false)
                            .setNegativeButton("OK",new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog,int id) {
                                    // if this button is clicked, just close
                                    // the dialog box and do nothing
                                    dialog.cancel();
                                }
                            });
                    AlertDialog alertDialog = alertDialogBuilder.create();
                    alertDialog.show();
                }else{
                    Intent photoselect = new Intent(Intent.ACTION_GET_CONTENT);
                    photoselect.setType("image/*");
                    startActivityForResult(photoselect, UPLOAD_CODE);
                }

            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == TAKE_PHOTO_CODE && resultCode == RESULT_OK) {
            Bitmap photo = (Bitmap) data.getExtras().get("data");
            userImage.setImageBitmap(photo);
            System.out.println("Image captured");

        }
        else if(requestCode == UPLOAD_CODE && resultCode == RESULT_OK){
            Uri chosenImageUri = data.getData();

            Bitmap mBitmap = null;
            try {
                mBitmap = MediaStore.Images.Media.getBitmap(this.getContentResolver(), chosenImageUri);
                userImage.setImageBitmap(mBitmap);
            }catch (IOException e){
                e.printStackTrace();
            }
        }
    }
    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String permissions[], int[] grantResults) {
        System.out.println(MY_PERMISSIONS_REQUEST_GET_LOCATION);
        switch (requestCode) {

            case MY_PERMISSIONS_REQUEST_GET_LOCATION: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    System.out.println("request granted");
                    // permission was granted, yay! Do the
                    // contacts-related task you need to do.


                    } else {
                    System.out.println("request deny");
                    // permission denied, boo! Disable the
                    // functionality that depends on this permission.
                }
                return;
            }

            // other 'case' lines to check for other
            // permissions this app might request
        }
    }

    public void getAddress(){
/*
        if (ContextCompat.checkSelfPermission(SignUp.this,
                Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED) {
            System.out.println("location request");
            userCurrentLocation.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, userCurrentLocationListener);
        }
        */
        EditText maddline1 = (EditText) findViewById(addline1);
        EditText maddline2 = (EditText) findViewById(addline2);
        String cityName=null;

        String StreetName = null;
        double longitude=0, latitude=0;


        //Getting the address of the user based on latitude and longitude.
        try {

            Location location = userCurrentLocation.getLastKnownLocation(userCurrentLocation.GPS_PROVIDER);
            if (location != null) {
                System.out.println("GPS is currently active");
                latitude = location.getLatitude();
                longitude = location.getLongitude();
                geocoder = new Geocoder(this);
                List<Address> addresses = geocoder.getFromLocation(latitude, longitude, 1);
                Address address = addresses.get(0);
                maddline1.setText(address.getAddressLine(0));
                maddline2.setText(address.getAddressLine(1)+"," +address.getCountryCode());
                userAddress =  new StringBuilder();
                for (int i = 0; i < address.getMaxAddressLineIndex(); i++) {
                    userAddress.append(address.getAddressLine(i)).append("\t");
                }
                userAddress.append(address.getCountryName()).append("\t");
                System.out.println(userAddress.toString());
            }
            else{
                if (ContextCompat.checkSelfPermission(SignUp.this,
                        Manifest.permission.ACCESS_FINE_LOCATION)
                        == PackageManager.PERMISSION_GRANTED) {
                    userCurrentLocation.requestLocationUpdates(userCurrentLocation.GPS_PROVIDER, 0, 0, userCurrentLocationListener);

                }
            }


        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }

    }

    public void submitform(View v){

        if (ContextCompat.checkSelfPermission(SignUp.this,
                Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED) {
            AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(context);
            alertDialogBuilder.setTitle("Storage");
            alertDialogBuilder
                    .setMessage("Storage permission must be given to submit this form")
                    .setCancelable(false)
                    .setNegativeButton("OK",new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog,int id) {
                            // if this button is clicked, just close
                            // the dialog box and do nothing
                            dialog.cancel();
                        }
                    });
            AlertDialog alertDialog = alertDialogBuilder.create();
            alertDialog.show();
        }else{
//saving photo to internal storage.
            File user_file = new File(getApplicationContext().getFilesDir(), "userimage.jpg");

            userImage.setDrawingCacheEnabled(true);
            Bitmap bitmap = userImage.getDrawingCache();
            if(user_file.exists()){
                System.out.println("file exists");
                user_file.delete();
            }

            try
            {

                user_file.createNewFile();
                FileOutputStream ostream = new FileOutputStream(user_file);
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, ostream);
                ostream.close();
                System.out.println("image saved");

                Intent redirect = new Intent(SignUp.this, Home.class);
                startActivity(redirect);
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }

        }



    }
    public void cancelApp(View v){
        finish();
    }

}
